import sys
import os

input_img = r"C:\Users\안기정\.gemini\antigravity\brain\821c9c05-11cf-4c1f-baf4-23f4650d39e1\media__1771833273276.jpg"
output_img = r"c:\dev\department-b\public\logo.png"

try:
    import rembg
    from PIL import Image
    with open(input_img, "rb") as i:
        with open(output_img, "wb") as o:
            input_data = i.read()
            # Post-processing to avoid hard edges or using basic rembg
            output_data = rembg.remove(input_data)
            o.write(output_data)
    print("Background removed using rembg")
except ImportError:
    print("rembg not found, falling back to PIL")
    try:
        from PIL import Image
        def remove_white(input_path, output_path, tolerance=210):
            img = Image.open(input_path).convert("RGBA")
            datas = img.getdata()
            
            newData = []
            for item in datas:
                brightness = (item[0]+item[1]+item[2])/3
                if brightness > tolerance:
                    if brightness > 245:
                        newData.append((255,255,255,0))
                    else:
                        alpha = int(255 - (brightness - tolerance) * (255/(245-tolerance)))
                        if alpha < 0: alpha = 0
                        newData.append((item[0], item[1], item[2], alpha))
                else:
                    newData.append(item)
                    
            img.putdata(newData)
            img.save(output_path, "PNG")
        
        remove_white(input_img, output_img)
        print("Background removed using PIL")
    except Exception as e:
        print(f"Failed to use PIL: {e}")
