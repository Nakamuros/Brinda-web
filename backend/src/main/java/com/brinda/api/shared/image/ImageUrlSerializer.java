package com.brinda.api.shared.image;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.stereotype.Component;

import java.io.IOException;

/** Resuelve la ruta guardada contra IMAGES_BASE_URL al serializar la respuesta. */
@Component
public class ImageUrlSerializer extends JsonSerializer<String> {

    private final ImageProperties props;

    public ImageUrlSerializer(ImageProperties props) {
        this.props = props;
    }

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        String url = ImageUrls.resolve(props.baseUrl(), value);
        if (url == null) {
            gen.writeNull();
        } else {
            gen.writeString(url);
        }
    }
}
