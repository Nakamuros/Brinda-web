package com.brinda.api.catalog.repository;

import com.brinda.api.catalog.model.Product;
import com.brinda.api.catalog.model.ProductType;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.time.OffsetDateTime;
import java.util.List;

import java.util.Locale;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> activeCategory() {
        return (root, q, cb) -> cb.isTrue(root.get("category").get("active"));
    }

    public static Specification<Product> inCategorySlug(String slug) {
        return (root, q, cb) -> cb.equal(root.get("category").get("slug"), slug);
    }

    /** Visible en el catálogo público: is_available = true (stock 0 sigue visible, marcado como agotado). */
    public static Specification<Product> available() {
        return (root, q, cb) -> cb.isTrue(root.get("available"));
    }

    public static Specification<Product> ofType(ProductType type) {
        return (root, q, cb) -> cb.equal(root.get("productType"), type);
    }

    public static Specification<Product> hidden() {
        return (root, q, cb) -> cb.isFalse(root.get("available"));
    }

    /** Stock en el mínimo o por debajo. */
    public static Specification<Product> lowStock() {
        return (root, q, cb) -> cb.le(root.<Integer>get("stockQuantity"), root.<Integer>get("minStock"));
    }

    /** Con promoción activa. Única definición de "en oferta" para filtros y orden. */
    public static Specification<Product> onOffer(OffsetDateTime now) {
        return (root, q, cb) -> cb.or(activeOffer(root, cb, now), activePromo(root, cb, now));
    }

    /** Misma regla que PromoRule.isActive, expresada para la base de datos. */
    private static Predicate activePromo(Root<Product> root, CriteriaBuilder cb, OffsetDateTime now) {
        return cb.and(cb.isNotNull(root.get("promoBuy")), cb.isNotNull(root.get("promoPay")),
                cb.or(cb.isNull(root.get("promoEndsAt")), cb.greaterThan(root.<OffsetDateTime>get("promoEndsAt"), now)));
    }

    /** Misma regla que OfferRule.isActive, expresada para la base de datos. */
    private static Predicate activeOffer(Root<Product> root, CriteriaBuilder cb, OffsetDateTime now) {
        return cb.and(cb.isNotNull(root.get("discountPrice")),
                cb.or(cb.isNull(root.get("offerEndsAt")), cb.greaterThan(root.<OffsetDateTime>get("offerEndsAt"), now)));
    }

    /**
     * Orden del catálogo público: con stock primero, luego en oferta, destacados, nombre; desempate por id.
     * Se aplica dentro del Specification (no en el Pageable) para poder usar expresiones CASE.
     */
    public static Specification<Product> catalogOrder(OffsetDateTime now) {
        return (root, q, cb) -> {
            if (q != null && !Long.class.equals(q.getResultType())) {   // no ordenar la consulta de conteo
                Expression<Integer> outOfStock = cb.<Integer>selectCase()
                        .when(cb.greaterThan(root.<Integer>get("stockQuantity"), 0), 0).otherwise(1);
                Expression<Integer> noOffer = cb.<Integer>selectCase()
                        .when(cb.or(activeOffer(root, cb, now), activePromo(root, cb, now)), 0).otherwise(1);
                Expression<Integer> notCombo = cb.<Integer>selectCase()
                        .when(cb.equal(root.get("productType"), ProductType.COMBO), 0).otherwise(1);
                List<Order> order = List.of(cb.asc(outOfStock), cb.asc(noOffer), cb.asc(notCombo),
                        cb.desc(root.get("featured")), cb.asc(root.get("name")), cb.asc(root.get("id")));
                q.orderBy(order);
            }
            return cb.conjunction();
        };
    }

    public static Specification<Product> featured() {
        return (root, q, cb) -> cb.isTrue(root.get("featured"));
    }

    /** Búsqueda parametrizada; los comodines escritos por el usuario se escapan. */
    public static Specification<Product> nameContains(String text) {
        String pattern = "%" + escapeLike(text.trim().toLowerCase(Locale.ROOT)) + "%";
        return (root, q, cb) -> cb.like(cb.lower(root.get("name")), pattern, '\\');
    }

    private static String escapeLike(String s) {
        return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
