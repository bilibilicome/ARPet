package com.arpet.service;

import com.arpet.config.ArPetConfig;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Service
public class CartoonService {

    private final ArPetConfig arPetConfig;

    public CartoonService(ArPetConfig arPetConfig) {
        this.arPetConfig = arPetConfig;
    }

    public String generateCartoonImage(String originalFilename) throws IOException {
        Path originalPath = Paths.get(arPetConfig.getFile().getUploadPath(), originalFilename);
        
        if (!Files.exists(originalPath)) {
            throw new IOException("原始图片不存在");
        }

        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String randomId = UUID.randomUUID().toString().substring(0, 8);
        String cartoonFilename = "cartoon_" + timestamp + "_" + randomId + ".png";
        Path cartoonPath = Paths.get(arPetConfig.getFile().getCartoonPath(), cartoonFilename);

        try {
            BufferedImage originalImage = ImageIO.read(originalPath.toFile());
            
            BufferedImage cartoonImage = applyCartoonEffect(originalImage);
            
            ImageIO.write(cartoonImage, "png", cartoonPath.toFile());
            
            return cartoonFilename;
        } catch (Exception e) {
            Files.copy(originalPath, cartoonPath);
            return cartoonFilename;
        }
    }

    private BufferedImage applyCartoonEffect(BufferedImage originalImage) {
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        
        BufferedImage cartoonImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        
        int[] pixels = originalImage.getRGB(0, 0, width, height, null, 0, width);
        
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int index = y * width + x;
                int color = pixels[index];
                
                int alpha = (color >> 24) & 0xff;
                int red = (color >> 16) & 0xff;
                int green = (color >> 8) & 0xff;
                int blue = color & 0xff;
                
                int gray = (int)(0.299 * red + 0.587 * green + 0.114 * blue);
                
                red = quantizeColor(red);
                green = quantizeColor(green);
                blue = quantizeColor(blue);
                
                int newColor = (alpha << 24) | (red << 16) | (green << 8) | blue;
                cartoonImage.setRGB(x, y, newColor);
            }
        }
        
        return cartoonImage;
    }

    private int quantizeColor(int color) {
        int[] levels = {0, 64, 128, 192, 255};
        int closest = levels[0];
        int minDiff = 256;
        
        for (int level : levels) {
            int diff = Math.abs(color - level);
            if (diff < minDiff) {
                minDiff = diff;
                closest = level;
            }
        }
        
        return closest;
    }
}
