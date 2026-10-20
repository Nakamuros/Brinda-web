package com.brinda.api.shared.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtil {

    private SlugUtil() {
    }

    /** Slug único: agrega -2, -3... mientras {@code exists} diga que ya está tomado. */
    public static String unique(String name, java.util.function.Predicate<String> exists) {
        String base = slugify(name);
        String slug = base;
        for (int i = 2; exists.test(slug); i++) {
            slug = base + "-" + i;
        }
        return slug;
    }

    public static String slugify(String input) {
        String slug = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return slug.isEmpty() ? "item" : slug;
    }
}
