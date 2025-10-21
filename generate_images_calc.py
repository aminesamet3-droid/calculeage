#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generateur d'Images pour Calculage.fr
Theme: Violet/Mauve (different de bioage bleu/violet)
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Configuration couleurs brand Calculage (violet/mauve)
COLORS = {
    'purple': (102, 126, 234),   # #667eea
    'dark_purple': (118, 75, 162), # #764ba2
    'white': (255, 255, 255),
    'dark': (17, 24, 39),
    'light_purple': (139, 92, 246) # #8b5cf6
}

def create_gradient(width, height, color1, color2, direction='horizontal'):
    """Cree un degrade entre deux couleurs"""
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []

    if direction == 'horizontal':
        for x in range(width):
            mask_data.extend([int(255 * (x / width))] * height)
    elif direction == 'vertical':
        for y in range(height):
            mask_data.extend([int(255 * (y / height))] * width)
    elif direction == 'diagonal':
        for y in range(height):
            for x in range(width):
                mask_data.append(int(255 * ((x + y) / (width + height))))

    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def add_text_with_shadow(draw, text, position, font, fill_color, shadow_color, shadow_offset=3):
    """Ajoute du texte avec ombre portee"""
    x, y = position
    # Ombre
    draw.text((x + shadow_offset, y + shadow_offset), text, font=font, fill=shadow_color)
    # Texte principal
    draw.text(position, text, font=font, fill=fill_color)

def wrap_text(text, font, max_width):
    """Decoupe le texte en plusieurs lignes si trop long"""
    words = text.split(' ')
    lines = []
    current_line = []

    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = font.getbbox(test_line)
        width = bbox[2] - bbox[0]

        if width <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]

    if current_line:
        lines.append(' '.join(current_line))

    return lines

def create_image(width, height, title, subtitle='', output_path='image.jpg', gradient_direction='diagonal'):
    """Cree une image avec titre et sous-titre"""

    # Creer degrade
    img = create_gradient(width, height, COLORS['purple'], COLORS['dark_purple'], gradient_direction)
    draw = ImageDraw.Draw(img)

    # Overlay semi-transparent pour ameliorer lisibilite
    overlay = Image.new('RGBA', (width, height), (17, 24, 39, 100))
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(img)

    try:
        # Essayer de charger une police systeme
        title_font = ImageFont.truetype('arial.ttf', int(height * 0.12))
        subtitle_font = ImageFont.truetype('arial.ttf', int(height * 0.06))
        small_font = ImageFont.truetype('arial.ttf', int(height * 0.04))
    except:
        try:
            title_font = ImageFont.truetype('Arial.ttf', int(height * 0.12))
            subtitle_font = ImageFont.truetype('Arial.ttf', int(height * 0.06))
            small_font = ImageFont.truetype('Arial.ttf', int(height * 0.04))
        except:
            # Fallback sur police par defaut
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            small_font = ImageFont.load_default()

    # Calculer position centree pour le titre
    title_lines = wrap_text(title, title_font, width - 100)
    total_height = len(title_lines) * (height * 0.15)

    if subtitle:
        total_height += height * 0.1

    start_y = (height - total_height) / 2

    # Dessiner titre (multi-lignes si necessaire)
    current_y = start_y
    for line in title_lines:
        bbox = title_font.getbbox(line)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) / 2
        add_text_with_shadow(draw, line, (x, current_y), title_font, COLORS['white'], (0, 0, 0, 180))
        current_y += height * 0.15

    # Dessiner sous-titre
    if subtitle:
        subtitle_lines = wrap_text(subtitle, subtitle_font, width - 100)
        for line in subtitle_lines:
            bbox = subtitle_font.getbbox(line)
            text_width = bbox[2] - bbox[0]
            x = (width - text_width) / 2
            add_text_with_shadow(draw, line, (x, current_y), subtitle_font, COLORS['light_purple'], (0, 0, 0, 150))
            current_y += height * 0.08

    # Ajouter branding en bas
    branding = 'calculeage.fr'
    bbox = small_font.getbbox(branding)
    brand_width = bbox[2] - bbox[0]
    brand_x = (width - brand_width) / 2
    brand_y = height - height * 0.08
    add_text_with_shadow(draw, branding, (brand_x, brand_y), small_font, COLORS['white'], (0, 0, 0, 180), shadow_offset=2)

    # Sauvegarder avec compression optimale
    img.save(output_path, 'JPEG', quality=85, optimize=True)
    print(f'[OK] Cree: {output_path}')

def main():
    """Genere toutes les images necessaires"""

    # Creer dossier images s'il n'existe pas
    images_dir = 'images'
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)
        print(f'Dossier {images_dir}/ cree')

    print('\n=== GENERATION DES IMAGES CALCULAGE.FR ===\n')

    # 1. Hero Image (1200x600)
    create_image(
        1200, 600,
        'Calculer votre Age Exact',
        'Gratuit Instantane Precis',
        f'{images_dir}/hero-calculateur.jpg',
        'diagonal'
    )

    # 2-3. Social Images
    create_image(
        1200, 630,
        'Calcul d\'Age Exact',
        'En annees mois jours - Gratuit',
        f'{images_dir}/og-image-new.jpg',
        'horizontal'
    )

    create_image(
        1200, 630,
        'Calculez Votre Age Precis',
        'Resultat Instantane',
        f'{images_dir}/twitter-card.jpg',
        'vertical'
    )

    # 4-8. Images pages principales (800x400)
    main_pages = {
        'chat': 'Age de votre Chat',
        'chien': 'Age de votre Chien',
        'comparer': 'Comparer les Ages',
        'mois-jours': 'Age en Mois et Jours',
        'celebrites': 'Age des Celebrites'
    }

    gradients = ['horizontal', 'vertical', 'diagonal']
    gradient_index = 0

    for filename, title in main_pages.items():
        create_image(
            800, 400,
            title,
            'Calcul Gratuit',
            f'{images_dir}/{filename}.jpg',
            gradients[gradient_index % 3]
        )
        gradient_index += 1

    # 9-28. Images Blog (800x400)
    blog_images = {
        'calculer-age-sans-calculatrice': 'Calculer son Age sans Calculatrice',
        'difference-age-homme-femme': 'Difference d\'Age Homme Femme',
        'erreurs-courantes-calcul-age': 'Erreurs Courantes Calcul Age',
        'histoire-calcul-age': 'Histoire du Calcul d\'Age',
        'importance-age-exact': 'Importance de l\'Age Exact',
        'age-legal-france': 'Age Legal en France',
        'age-retraite-france': 'Age de Retraite en France',
        'annees-bissextiles': 'Les Annees Bissextiles',
        'calendrier-gregorien': 'Le Calendrier Gregorien',
        'celebrites-nees-meme-jour': 'Celebrites Nees le Meme Jour',
        'comparer-age-couple': 'Comparer l\'Age en Couple',
        'conversion-age-animal': 'Conversion Age Animal',
        'esperance-vie-pays': 'Esperance de Vie par Pays',
        'outils-calcul-age': 'Outils de Calcul d\'Age',
        'signes-astrologiques-age': 'Signes Astrologiques et Age',
        'age-vs-maturite': 'Age vs Maturite',
        'perception-age-societe': 'Perception de l\'Age en Societe',
        'calculer-age-grossesse': 'Calculer l\'Age de Grossesse',
        'age-chien-chat-humain': 'Age Chien Chat en Humain',
        'mythes-vieillissement': 'Mythes sur le Vieillissement'
    }

    for filename, title in blog_images.items():
        create_image(
            800, 400,
            title,
            'Guide Complet',
            f'{images_dir}/blog-{filename}.jpg',
            gradients[gradient_index % 3]
        )
        gradient_index += 1

    # 29-48. Images Ville (800x400)
    villes = [
        'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice',
        'Nantes', 'Bordeaux', 'Lille', 'Strasbourg', 'Rennes',
        'Montpellier', 'Grenoble', 'Dijon', 'Angers', 'Nimes',
        'Clermont-Ferrand', 'Tours', 'Limoges', 'Brest', 'Amiens'
    ]

    for ville in villes:
        create_image(
            800, 400,
            f'Calcul Age {ville}',
            'Outil Gratuit Local',
            f'{images_dir}/ville-{ville.lower().replace(" ", "-")}.jpg',
            gradients[gradient_index % 3]
        )
        gradient_index += 1

    total_images = 3 + len(main_pages) + len(blog_images) + len(villes)

    print(f'\n=== TERMINE ===')
    print(f'[OK] {total_images} images creees dans {images_dir}/')
    print(f'[OK] Pret pour integration')

if __name__ == '__main__':
    main()
