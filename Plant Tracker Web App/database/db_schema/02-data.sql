SET SQL_SAFE_UPDATES = 0;

-- Delete all plants (this will cascade to user_plants)
DELETE FROM plants;

-- updated w/ image url
INSERT INTO plants (name, scientific_name, watering_frequency, difficulty, sunlight, size, description, image_url, is_public) VALUES
('Lily', 'Lilium candidum', 7, 'Advanced', 'Full sun', 'Medium', 'Elegant white flowers with sweet fragrance', '/static/images/plants/lily.png', 1),
('Sunflower', 'Helianthus annuus', 8, 'Beginner', 'Full sun', 'Large', 'Tall annual with bright yellow flowers', '/static/images/plants/sunflower.png', 1),
('Coneflower', 'Echinacea purpurea', 4, 'Intermediate', 'Full sun to partial shade', 'Medium', 'Drought-tolerant perennial with purple flowers', '/static/images/plants/coneflower.png', 1),
('Snake Plant', 'Sansevieria trifasciata', 14, 'Beginner', 'Low to bright indirect', 'Medium', 'Almost unkillable, great for beginners', '/static/images/plants/snake plant.png', 1),
('Monstera', 'Monstera deliciosa', 7, 'Intermediate', 'Bright indirect', 'Large', 'Swiss cheese plant with iconic split leaves', '/static/images/plants/monstera.png', 1),
('Pothos', 'Epipremnum aureum', 7, 'Beginner', 'Low to bright indirect', 'Small', 'Trailing vine, perfect for hanging baskets', '/static/images/plants/pothos.png', 1),
('Buttonbush', 'Cephalanthus occidentalis', 5, 'Beginner', 'Full sun to partial shade', 'Large', 'Unique ball-shaped flowers that attract butterflies and pollinators', '/static/images/plants/buttonbush.png', 1),
('Hyacinth', 'Hyacinthus orientalis', 5, 'Intermediate', 'Full sun to partial shade', 'Small', 'Highly fragrant spring bulb with dense flower spikes in multiple colors', '/static/images/plants/hyacinth.png', 1),
('Poppy', 'Papaver somniferum', 5, 'Beginner', 'Full sun', 'Medium', 'Delicate papery flowers in vibrant red, orange, and pink', '/static/images/plants/poppy.png', 1),
('Tulip', 'Tulipa gesneriana', 5, 'Intermediate', 'Full sun', 'Medium', 'Classic spring bulb with cup-shaped flowers in rainbow colors', '/static/images/plants/tulip.png', 1);



--  (AI GENERATED) plants for into database --> trying to add images for most
INSERT INTO plants (name, scientific_name, watering_frequency, difficulty, sunlight, size, description, is_public) VALUES
-- Succulents & Cacti
('Aloe Vera', 'Aloe barbadensis', 14, 'Beginner', 'Bright indirect', 'Medium', 'Medicinal plant with healing properties', 1),
('Jade Plant', 'Crassula ovata', 14, 'Beginner', 'Bright indirect', 'Medium', 'Lucky plant with thick woody stems', 1),
('Burros Tail', 'Sedum morganianum', 14, 'Intermediate', 'Bright indirect', 'Small', 'Trailing succulent with bead-like leaves', 1),
('Christmas Cactus', 'Schlumbergera bridgesii', 10, 'Intermediate', 'Bright indirect', 'Medium', 'Blooms around winter holidays', 1),

-- Tropicals
('Peace Lily', 'Spathiphyllum wallisii', 7, 'Beginner', 'Low to bright indirect', 'Medium', 'Elegant white flowers, tolerates low light', 1),
('Fiddle Leaf Fig', 'Ficus lyrata', 7, 'Intermediate', 'Bright indirect', 'Large', 'Trendy plant with large violin-shaped leaves', 1),
('Rubber Plant', 'Ficus elastica', 7, 'Beginner', 'Bright indirect', 'Large', 'Large glossy leaves, comes in dark green or variegated', 1),
('Chinese Evergreen', 'Aglaonema commutatum', 7, 'Beginner', 'Low to bright indirect', 'Medium', 'Colorful foliage, tolerates neglect', 1),

-- Ferns & Foliage
('Boston Fern', 'Nephrolepis exaltata', 3, 'Intermediate', 'Bright indirect', 'Medium', 'Classic fern with arching fronds', 1),
('Maidenhair Fern', 'Adiantum raddianum', 3, 'Advanced', 'Indirect light', 'Small', 'Delicate fronds with black stems', 1),
('Calathea', 'Calathea orbifolia', 5, 'Advanced', 'Bright indirect', 'Medium', 'Stunning patterned leaves that move', 1),

-- Flowering
('African Violet', 'Saintpaulia ionantha', 5, 'Intermediate', 'Bright indirect', 'Small', 'Compact plant with velvety flowers', 1),
('Orchid', 'Phalaenopsis spp.', 10, 'Intermediate', 'Bright indirect', 'Medium', 'Exotic long-blooming flowers', 1),
('Anthurium', 'Anthurium andraeanum', 7, 'Intermediate', 'Bright indirect', 'Medium', 'Heart-shaped red or pink flowers', 1),

-- Herbs (if you want edibles)
('Basil', 'Ocimum basilicum', 3, 'Beginner', 'Full sun', 'Medium', 'Fragrant culinary herb', 1),
('Rosemary', 'Salvia rosmarinus', 7, 'Beginner', 'Full sun', 'Medium', 'Aromatic evergreen herb', 1),
('Mint', 'Mentha spp.', 3, 'Beginner', 'Partial sun', 'Medium', 'Fast-growing fragrant herb', 1),

-- Outdoor Plants
('Lavender', 'Lavandula angustifolia', 7, 'Beginner', 'Full sun', 'Medium', 'Fragrant purple flowers, drought tolerant', 1),
('Hydrangea', 'Hydrangea macrophylla', 3, 'Intermediate', 'Partial shade', 'Large', 'Large flower clusters that change color', 1),
('Rose', 'Rosa spp.', 5, 'Advanced', 'Full sun', 'Large', 'Classic romantic flowers', 1),

-- Flowering Houseplants (AI GENERATED)
('Bromeliad', 'Guzmania lingulata', 5, 'Beginner', 'Bright indirect', 'Medium', 'Tropical plant with colorful long-lasting bracts', 1),
('Hibiscus', 'Hibiscus rosa-sinensis', 3, 'Intermediate', 'Full sun', 'Large', 'Large showy flowers in red, yellow, pink, or orange', 1),
('Bougainvillea', 'Bougainvillea glabra', 7, 'Intermediate', 'Full sun', 'Large', 'Vibrant papery bracts in purple, pink, or orange', 1),
('Gardenia', 'Gardenia jasminoides', 5, 'Advanced', 'Bright indirect', 'Medium', 'Highly fragrant white flowers, needs humidity', 1),
('Jasmine', 'Jasminum polyanthum', 5, 'Intermediate', 'Bright indirect', 'Medium', 'Sweetly scented white or pink flowers', 1),

-- Foliage Plants
('Arrowhead Plant', 'Syngonium podophyllum', 7, 'Beginner', 'Low to bright indirect', 'Medium', 'Arrow-shaped leaves that change shape as they mature', 1),
('Dieffenbachia', 'Dieffenbachia seguine', 7, 'Beginner', 'Low to bright indirect', 'Large', 'Large variegated leaves with cream or yellow spots', 1),
('Dracaena', 'Dracaena marginata', 10, 'Beginner', 'Low to bright indirect', 'Large', 'Thin striped leaves on cane-like stems', 1),
('Parlor Palm', 'Chamaedorea elegans', 7, 'Beginner', 'Low light', 'Medium', 'Elegant palm perfect for low light conditions', 1),
('Cast Iron Plant', 'Aspidistra elatior', 14, 'Beginner', 'Low light', 'Medium', 'Almost indestructible, tolerates extreme neglect', 1),
('Croton', 'Codiaeum variegatum', 5, 'Intermediate', 'Bright indirect', 'Medium', 'Colorful leaves in red, yellow, orange, and green', 1),
('Polka Dot Plant', 'Hypoestes phyllostachya', 5, 'Beginner', 'Bright indirect', 'Small', 'Pink or white spotted leaves, very colorful', 1),

-- Succulents & Cacti
('Panda Plant', 'Kalanchoe tomentosa', 14, 'Beginner', 'Bright indirect', 'Small', 'Fuzzy silver-green leaves with brown edges', 1),
('String of Pearls', 'Senecio rowleyanus', 14, 'Intermediate', 'Bright indirect', 'Small', 'Unique bead-like leaves on trailing stems', 1),
('Zebra Cactus', 'Haworthia fasciata', 14, 'Beginner', 'Bright indirect', 'Small', 'Striped white bands on pointed leaves', 1),
('Bunny Ears Cactus', 'Opuntia microdasys', 14, 'Beginner', 'Full sun', 'Medium', 'Pad-like stems with fuzzy spots instead of spines', 1),
('Echeveria', 'Echeveria elegans', 14, 'Beginner', 'Bright indirect', 'Small', 'Rosette-forming succulent with pastel colors', 1),

-- Trailing & Hanging Plants
('String of Hearts', 'Ceropegia woodii', 10, 'Beginner', 'Bright indirect', 'Small', 'Heart-shaped leaves on delicate trailing vines', 1),
('English Ivy', 'Hedera helix', 7, 'Beginner', 'Low to bright indirect', 'Medium', 'Classic trailing vine with lobed leaves', 1),
('Spider Plant', 'Chlorophytum comosum', 7, 'Beginner', 'Low to bright indirect', 'Medium', 'Arching leaves with baby spiderettes', 1),
('Wandering Jew', 'Tradescantia zebrina', 5, 'Beginner', 'Bright indirect', 'Small', 'Striped purple and silver trailing leaves', 1),

-- Large Statement Plants
('Bird of Paradise', 'Strelitzia reginae', 7, 'Intermediate', 'Bright indirect', 'Large', 'Large banana-like leaves with exotic orange flowers', 1),
('Norfolk Pine', 'Araucaria heterophylla', 7, 'Intermediate', 'Bright indirect', 'Large', 'Soft needled pine, perfect for indoor Christmas tree', 1),
('Umbrella Tree', 'Schefflera arboricola', 7, 'Beginner', 'Bright indirect', 'Large', 'Glossy leaves in umbrella-like clusters', 1),
('Corn Plant', 'Dracaena fragrans', 10, 'Beginner', 'Low to bright indirect', 'Large', 'Corn-like leaves on woody stems', 1),

-- Air Purifying Plants (NASA recommended)
('Areca Palm', 'Dypsis lutescens', 5, 'Intermediate', 'Bright indirect', 'Large', 'Feathery arching fronds, excellent air purifier', 1),
('Lady Palm', 'Rhapis excelsa', 7, 'Beginner', 'Low to bright indirect', 'Medium', 'Dense fan-shaped leaves on bamboo-like stems', 1),
('Bamboo Palm', 'Chamaedorea seifrizii', 7, 'Beginner', 'Low light', 'Medium', 'Clustering palm with cane-like stems', 1),
('Gerbera Daisy', 'Gerbera jamesonii', 3, 'Intermediate', 'Full sun', 'Small', 'Bright colorful daisy flowers, removes benzene', 1),

-- Unusual & Unique
('Venus Flytrap', 'Dionaea muscipula', 3, 'Advanced', 'Full sun', 'Small', 'Carnivorous plant with jaw-like traps', 1),
('Living Stone', 'Lithops spp.', 20, 'Intermediate', 'Full sun', 'Small', 'Stone-like succulent that blends with pebbles', 1),
('Sensitive Plant', 'Mimosa pudica', 5, 'Intermediate', 'Bright indirect', 'Small', 'Leaves fold when touched, fun interactive plant', 1),
('Air Plant', 'Tillandsia ionantha', 7, 'Beginner', 'Bright indirect', 'Small', 'Grows without soil, absorbs water from air', 1),
('Oxalis', 'Oxalis triangularis', 5, 'Beginner', 'Bright indirect', 'Small', 'Purple butterfly-shaped leaves that close at night', 1),

-- Herbs & Edibles (additional)
('Cilantro', 'Coriandrum sativum', 3, 'Beginner', 'Full sun', 'Small', 'Fresh herb for salsas and Asian dishes', 1),
('Parsley', 'Petroselinum crispum', 3, 'Beginner', 'Full sun', 'Small', 'Curly or flat-leaf culinary herb', 1),
('Thyme', 'Thymus vulgaris', 5, 'Beginner', 'Full sun', 'Small', 'Aromatic herb with tiny leaves', 1),
('Oregano', 'Origanum vulgare', 5, 'Beginner', 'Full sun', 'Small', 'Pungent herb for Italian and Greek cooking', 1),
('Chives', 'Allium schoenoprasum', 3, 'Beginner', 'Full sun', 'Small', 'Mild onion flavor, purple edible flowers', 1),

-- Outdoor/Indoor Flowering
('Marigold', 'Tagetes erecta', 3, 'Beginner', 'Full sun', 'Medium', 'Bright yellow/orange flowers, natural pest repellent', 1),
('Zinnia', 'Zinnia elegans', 3, 'Beginner', 'Full sun', 'Medium', 'Vibrant daisy-like flowers in rainbow colors', 1),
('Petunia', 'Petunia x hybrida', 3, 'Beginner', 'Full sun', 'Small', 'Trailing or mounding flowers in many colors', 1),
('Geranium', 'Pelargonium hortorum', 5, 'Beginner', 'Full sun', 'Medium', 'Clusters of red, pink, or white flowers', 1),
('Impatiens', 'Impatiens walleriana', 3, 'Beginner', 'Partial shade', 'Medium', 'Shade-loving plant with bright flowers', 1);