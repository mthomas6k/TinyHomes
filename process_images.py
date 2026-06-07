from PIL import Image

def process_icon(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # More aggressive background removal and clean edges
    for item in datas:
        # Assuming white/off-white background
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Crop to bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

def process_full_logo(input_path, output_dark_path, output_light_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    dark_data = []
    light_data = []
    
    for item in datas:
        # Background is beige-ish, let's say r > 230, g > 230, b > 220
        # Looking at the image, it's very light. Let's use a threshold.
        # Actually, let's check distance to the dark blue color vs gold color.
        # Dark blue: ~ #1D3A6B (r=29, g=58, b=107)
        # Gold: ~ #E1C158
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            # It's background
            dark_data.append((255, 255, 255, 0))
            light_data.append((255, 255, 255, 0))
        else:
            dark_data.append(item)
            
            # If it's dark blue (low red/green, higher blue, or just generally dark)
            # Let's say if it's NOT gold. Gold has high red and green, low blue.
            # Blue has low red, low green, higher blue.
            # Let's invert the dark pixels to white.
            # A simple rule: if it's dark (R < 150, G < 150), make it white.
            if item[0] < 150 and item[1] < 150:
                # Keep alpha, set to white
                light_data.append((255, 255, 255, item[3]))
            else:
                # Keep gold/other colors as is
                light_data.append(item)

    # Save dark version
    img_dark = Image.new("RGBA", img.size)
    img_dark.putdata(dark_data)
    bbox_dark = img_dark.getbbox()
    if bbox_dark:
        img_dark = img_dark.crop(bbox_dark)
    img_dark.save(output_dark_path, "PNG")
    
    # Save light version
    img_light = Image.new("RGBA", img.size)
    img_light.putdata(light_data)
    bbox_light = img_light.getbbox()
    if bbox_light:
        img_light = img_light.crop(bbox_light)
    img_light.save(output_light_path, "PNG")

process_icon("/Users/marshall/.gemini/antigravity/brain/f3c3f57e-89cd-436e-9575-fe077f3c06b4/media__1780846788827.png", "images/icon.png")
process_full_logo("/Users/marshall/.gemini/antigravity/brain/f3c3f57e-89cd-436e-9575-fe077f3c06b4/media__1780848991653.png", "images/logo-full-dark.png", "images/logo-full-light.png")

print("Images processed successfully.")
