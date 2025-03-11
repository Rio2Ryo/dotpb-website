from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder_image(filename, text, size=(400, 400), bg_color=(240, 240, 240), text_color=(100, 100, 100)):
    # 画像を作成
    img = Image.new('RGB', size, color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # 中央に円を描画
    circle_radius = min(size) // 4
    circle_center = (size[0] // 2, size[1] // 2)
    draw.ellipse(
        (
            circle_center[0] - circle_radius,
            circle_center[1] - circle_radius,
            circle_center[0] + circle_radius,
            circle_center[1] + circle_radius
        ),
        outline=(180, 180, 180),
        width=2
    )
    
    # テキストを描画
    try:
        # フォントが利用可能な場合
        font = ImageFont.truetype("arial.ttf", 20)
    except IOError:
        # フォントが利用できない場合はデフォルトフォントを使用
        font = ImageFont.load_default()
    
    # テキストのサイズを取得して中央に配置
    text_width = draw.textlength(text, font=font)
    text_position = ((size[0] - text_width) // 2, size[1] // 2 + circle_radius + 20)
    
    draw.text(text_position, text, font=font, fill=text_color)
    
    # 画像を保存
    img.save(filename)
    print(f"Created image: {filename}")

def main():
    # 画像保存ディレクトリの確認
    image_dir = os.path.join(os.path.dirname(__file__), 'images')
    if not os.path.exists(image_dir):
        os.makedirs(image_dir)
    
    # 製品画像の作成
    products = [
        ("product-hero.jpg", "dotpb Hero Image", (800, 400)),
        ("product1.jpg", "ヒアルロン酸セラム"),
        ("product2.jpg", "ナイアシンアミドセラム"),
        ("product3.jpg", "アスコルビン酸パウダー"),
        ("product4.jpg", "サッカロミセスファーメント")
    ]
    
    for product in products:
        filename = os.path.join(image_dir, product[0])
        text = product[1]
        size = product[2] if len(product) > 2 else (400, 400)
        create_placeholder_image(filename, text, size)

if __name__ == "__main__":
    main()
