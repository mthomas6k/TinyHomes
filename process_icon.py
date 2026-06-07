from PIL import Image

def process_icon(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    # More aggressive background removal and clean edges
    for item in datas:
        # Assuming white/off-white background
        # Let's say if all RGB values are > 200, make it transparent
        if item[0] > 200 and item[1] > 200 and item[2] > 200:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    
    # Crop to bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")

process_icon("/Users/marshall/.gemini/antigravity/brain/f3c3f57e-89cd-436e-9575-fe077f3c06b4/media__1780846788827.png", "images/logo.png")
print("Icon cropped and processed.")
