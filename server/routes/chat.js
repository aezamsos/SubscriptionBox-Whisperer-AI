const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Force simulated responses if environment variable is set
const useSimulatedResponses = process.env.USE_SIMULATED_RESPONSES === 'true';
// Determine which AI provider to use
const aiProvider = process.env.AI_PROVIDER || 'openai';

// Initialize the OpenAI client if API key is available and simulated responses are not forced
let openai = null;
if (process.env.OPENAI_API_KEY && !useSimulatedResponses && aiProvider === 'openai') {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.error('Error initializing OpenAI client:', error.message);
  }
} else if (aiProvider === 'openai') {
  if (useSimulatedResponses) {
    console.log('Using simulated responses (USE_SIMULATED_RESPONSES=true)');
  } else {
    console.warn('OPENAI_API_KEY not set - using fallback responses');
  }
}

// Initialize the Gemini client if API key is available and simulated responses are not forced
let gemini = null;
if (process.env.GEMINI_API_KEY && !useSimulatedResponses && aiProvider === 'gemini') {
  try {
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Gemini client initialized successfully');
  } catch (error) {
    console.error('Error initializing Gemini client:', error.message);
  }
} else if (aiProvider === 'gemini') {
  if (useSimulatedResponses) {
    console.log('Using simulated responses (USE_SIMULATED_RESPONSES=true)');
  } else {
    console.warn('GEMINI_API_KEY not set - using fallback responses');
  }
}

// Helper function for generating simulated AI responses
const getSimulatedResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  
  // Jewelry-specific responses
  if (lowerMsg.includes('jewelry') || lowerMsg.includes('jewellery') || lowerMsg.includes('ornament')) {
    if (lowerMsg.includes('necklace') || lowerMsg.includes('pendant')) {
      return "Indian necklaces are stunning! Traditional designs include Kundan, Polki, Meenakari, and Temple jewelry. Would you prefer gold-plated pieces or pure gold? Do you like colorful gemstones or a more minimalist design?";
    } else if (lowerMsg.includes('earring') || lowerMsg.includes('jhumka')) {
      return "Jhumkas are iconic Indian earrings! They come in various styles - traditional with bells, contemporary with stones, or minimalist designs. Do you prefer dangling earrings or studs? And would you like them in oxidized silver, gold-plated, or with colorful enamel work?";
    } else if (lowerMsg.includes('bangle') || lowerMsg.includes('bracelet')) {
      return "Indian bangles are versatile and beautiful! From intricate Kada bangles to delicate charm bracelets with traditional motifs. Would you prefer metal bangles, ones with glass work, or those with intricate carving? Gold-tone or silver-tone?";
    } else if (lowerMsg.includes('ring') || lowerMsg.includes('finger')) {
      return "Indian rings often feature beautiful stonework! Are you interested in statement rings with traditional motifs, delicate bands with small stones, or perhaps adjustable rings with traditional designs?";
    } else {
      return "Indian jewelry is known for its rich heritage and intricate designs! Would you prefer traditional temple jewelry, colorful meenakari work, kundan pieces with glass stones, or perhaps modern fusion pieces? Gold-tone or silver-tone?";
    }
  }
  
  // Beauty/cosmetics specific responses
  if (lowerMsg.includes('beauty') || lowerMsg.includes('cosmetic') || lowerMsg.includes('makeup')) {
    if (lowerMsg.includes('skin') || lowerMsg.includes('face')) {
      return "Indian skincare often incorporates Ayurvedic principles with ingredients like turmeric, saffron, and sandalwood! Are you looking for cleansers, moisturizers, face masks, or serums? Do you have any specific skin concerns like dryness or brightening?";
    } else if (lowerMsg.includes('hair') || lowerMsg.includes('shampoo')) {
      return "Traditional Indian hair care uses natural ingredients like amla, shikakai, and hibiscus! Are you interested in hair oils, masks, shampoos with traditional ingredients, or perhaps treatments for specific concerns?";
    } else if (lowerMsg.includes('lipstick') || lowerMsg.includes('lip')) {
      return "Indian beauty brands offer lipsticks in beautiful shades that complement Indian skin tones! Do you prefer matte, glossy, or satin finishes? Perhaps traditional reds and browns, or brighter pinks and corals?";
    } else if (lowerMsg.includes('eye') || lowerMsg.includes('kajal') || lowerMsg.includes('kohl')) {
      return "Kajal is a staple in Indian beauty! Would you like traditional kajal pencils, modern eyeliners, eye shadows in versatile colors, or perhaps mascaras from Indian beauty brands?";
    } else {
      return "Indian beauty products blend traditional ingredients with modern formulations! Are you interested in makeup (like kajal, bindis, sindoor), skincare (with ingredients like turmeric or saffron), or haircare (with amla or bhringraj)? Any specific products you'd like to explore?";
    }
  }
  
  // General responses
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return "Namaste! I'm your personal box curator specializing in Indian jewelry and beauty products. Tell me what styles of jewelry you enjoy (like temple jewelry, kundan, or oxidized silver) or what beauty products interest you (maybe ayurvedic skincare or traditional kajal), and I'll help create the perfect subscription box for you!";
  } else if (lowerMsg.includes('traditional') || lowerMsg.includes('culture')) {
    return "I love curating boxes with traditional Indian elements! For jewelry, I can include pieces inspired by regional styles like Temple jewelry from South India or Meenakari from Rajasthan. For beauty, perhaps traditional ingredients like turmeric face masks or rose water toners. Would you like to focus more on jewelry, beauty products, or a mix of both?";
  } else if (lowerMsg.includes('wedding') || lowerMsg.includes('bridal')) {
    return "Indian bridal jewelry and beauty products are exquisite! I can curate special occasion pieces like statement necklaces with kundan work, matching jhumkas, or bridal bangles. For beauty, perhaps bridal mehendi kits, special occasion bindis, or skincare for bridal glow. Are you looking for yourself or as a gift?";
  } else if (lowerMsg.includes('gift') || lowerMsg.includes('present')) {
    return "Indian jewelry and beauty products make wonderful gifts! I can help create a gift box with versatile pieces like a delicate pendant necklace, matching earrings, and perhaps a beauty product like rose water or saffron face cream. Who are you shopping for, and what's the occasion?";
  } else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('budget')) {
    return "We have options for various budgets! Our jewelry ranges from affordable silver-plated pieces (₹500-1500) to premium gold-plated items (₹1500-5000). Beauty products typically range from ₹300-2000 depending on the brand and type. What price range would you be comfortable with for your subscription box?";
  } else {
    return "Based on what you've shared, I can recommend some beautiful Indian jewelry and beauty products for your box! Would you like me to suggest some specific types of jewelry pieces (like earrings, necklaces, or bangles) or beauty products (skincare, haircare, or makeup with traditional ingredients)? Or tell me more about your preferences!";
  }
};

// @route   POST api/chat/message
// @desc    Process a chat message and get AI response
// @access  Private
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Use simulated responses if AI keys are not available or if forced via config
    if (useSimulatedResponses || (aiProvider === 'openai' && !openai) || (aiProvider === 'gemini' && !gemini)) {
      if (useSimulatedResponses) {
        console.log('Using simulated response (forced via config)');
      } else {
        console.warn(`${aiProvider.toUpperCase()} client not initialized, using simulated responses`);
      }
      
      // Get a simulated response based on the message content
      const response = getSimulatedResponse(message);
      return res.json({ response });
    }
    
    // Use OpenAI API for chat completion
    if (aiProvider === 'openai' && openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o", // Using a powerful model for personalized recommendations
          messages: [
            {
              role: "system",
              content: `You are a subscription box curator named BoxWhisperer specializing in Indian jewelry and beauty products. 
              Your job is to help customers create personalized subscription boxes based on their preferences.
              Focus on traditional Indian jewelry (like kundan, meenakari, temple jewelry, oxidized silver) and beauty products 
              (ayurvedic skincare, traditional cosmetics like kajal and sindoor, hair oils, etc).
              Be helpful, friendly, and provide specific product recommendations.
              Focus on understanding the customer's preferences in categories like jewelry types, gemstones, metals, skincare ingredients, etc.
              Always try to ask follow-up questions to refine your understanding of their preferences.
              Always mention prices in Indian Rupees (₹).
              Keep responses concise and conversational.`
            },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 300,
        });
        
        // Extract the response from the API result
        const response = completion.choices[0].message.content;
        
        res.json({ response });
      } catch (openaiError) {
        console.error('Error using OpenAI API:', openaiError);
        
        // Fall back to simulated response if OpenAI API call fails
        const fallbackResponse = getSimulatedResponse(message);
        res.json({ response: fallbackResponse });
      }
    } 
    // Use Gemini API for chat completion
    else if (aiProvider === 'gemini' && gemini) {
      try {
        const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        const prompt = `You are a subscription box curator named BoxWhisperer specializing in Indian jewelry and beauty products. 
        Your job is to help customers create personalized subscription boxes based on their preferences.
        Focus on traditional Indian jewelry (like kundan, meenakari, temple jewelry, oxidized silver) and beauty products 
        (ayurvedic skincare, traditional cosmetics like kajal and sindoor, hair oils, etc).
        Be helpful, friendly, and provide specific product recommendations.
        Focus on understanding the customer's preferences in categories like jewelry types, gemstones, metals, skincare ingredients, etc.
        Always try to ask follow-up questions to refine your understanding of their preferences.
        Always mention prices in Indian Rupees (₹).
        Keep responses concise and conversational.
        
        User message: ${message}`;
        
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        res.json({ response });
      } catch (geminiError) {
        console.error('Error using Gemini API:', geminiError);
        
        // Fall back to simulated response if Gemini API call fails
        const fallbackResponse = getSimulatedResponse(message);
        res.json({ response: fallbackResponse });
      }
    }
  } catch (err) {
    console.error('Error processing chat:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chat/recommendations
// @desc    Get product recommendations based on preferences
// @access  Private
router.post('/recommendations', auth, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Sample Indian jewelry and beauty products for demo purposes
    const sampleIndianProducts = [
      {
        name: "Traditional Kundan Necklace",
        description: "Handcrafted kundan necklace with intricate gold work and red stones",
        image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=500&auto=format&fit=crop",
        price: 2499,
        category: "jewelry"
      },
      {
        name: "Meenakari Jhumka Earrings",
        description: "Colorful enamel work jhumka earrings with peacock design",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=500&auto=format&fit=crop",
        price: 1299,
        category: "jewelry"
      },
      {
        name: "Kumkumadi Face Oil",
        description: "Ayurvedic facial oil with saffron for brightening and even skin tone",
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=500&auto=format&fit=crop",
        price: 850,
        category: "beauty"
      },
      {
        name: "Silver Oxidized Bangle Set",
        description: "Set of 6 oxidized silver bangles with traditional motifs",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500&auto=format&fit=crop",
        price: 1199,
        category: "jewelry"
      },
      {
        name: "Authentic Kajal Stick",
        description: "Traditional kohl made with natural ingredients for eye definition",
        image: "https://images.unsplash.com/photo-1631730359585-45980d14f471?q=80&w=500&auto=format&fit=crop",
        price: 399,
        category: "beauty"
      },
      {
        name: "Handmade Sandalwood Soap",
        description: "Natural soap with sandalwood oil and turmeric for glowing skin",
        image: "https://images.unsplash.com/photo-1607006344380-b6775a0824ce?q=80&w=500&auto=format&fit=crop",
        price: 299,
        category: "beauty"
      },
      {
        name: "Temple Jewelry Hair Accessory",
        description: "South Indian style hair ornament with pearl and gold detailing",
        image: "https://images.unsplash.com/photo-1625148351255-9d40a30d5f9c?q=80&w=500&auto=format&fit=crop",
        price: 999,
        category: "jewelry"
      },
      {
        name: "Rose Water Facial Toner",
        description: "Pure distilled rose water for refreshing and toning skin",
        image: "https://images.unsplash.com/photo-1601055903647-ddf1ee9701c6?q=80&w=500&auto=format&fit=crop",
        price: 450,
        category: "beauty"
      }
    ];
    
    if (!preferences || preferences.length === 0) {
      // Return default recommendations
      const productsCount = await Product.countDocuments();
      
      if (productsCount === 0) {
        // Create sample products for demo purposes
        await Product.insertMany(sampleIndianProducts);
        const products = await Product.find();
        return res.json(products);
      } else {
        const products = await Product.find().limit(4);
        return res.json(products);
      }
    }
    
    // If we have a valid AI client initialized and not forced to use simulated responses
    let validAiClient = false;
    if (!useSimulatedResponses) {
      if (aiProvider === 'openai' && openai) validAiClient = true;
      if (aiProvider === 'gemini' && gemini) validAiClient = true;
    }

    if (validAiClient) {
      try {
        // First, get existing products from the database
        const existingProducts = await Product.find();
        
        // If there are no existing products, create sample products
        if (existingProducts.length === 0) {
          await Product.insertMany(sampleIndianProducts);
          const products = await Product.find();
          return res.json(products);
        }
        
        // Create a list of products for the AI API to reference
        const productsList = existingProducts.map(p => ({
          id: p._id.toString(),
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price
        }));
        
        // Use OpenAI or Gemini to generate personalized recommendations based on preferences
        let recommendedIds = [];
        
        if (aiProvider === 'openai' && openai) {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are an AI product recommendation system for an Indian jewelry and beauty subscription box service.
                The user will provide preferences, and your task is to select the most relevant products from the available inventory.
                Return ONLY a valid JSON array containing the IDs of the 4 most relevant products based on the user preferences.
                Format: ["id1", "id2", "id3", "id4"]
                Available products: ${JSON.stringify(productsList)}`
              },
              { 
                role: "user", 
                content: `Based on these preferences: ${preferences.join(", ")}, recommend 4 relevant products from the inventory. Return ONLY the array of product IDs in JSON format.` 
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
            max_tokens: 150,
          });
          
          // Parse the recommended product IDs
          recommendedIds = JSON.parse(completion.choices[0].message.content).recommended_products || [];
        } else if (aiProvider === 'gemini' && gemini) {
          const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
          
          const prompt = `You are an AI product recommendation system for an Indian jewelry and beauty subscription box service.
          The user will provide preferences, and your task is to select the most relevant products from the available inventory.
          Return ONLY a valid JSON object containing an array named 'recommended_products' with the IDs of the 4 most relevant products based on the user preferences.
          Format: { "recommended_products": ["id1", "id2", "id3", "id4"] }
          Available products: ${JSON.stringify(productsList)}
          
          Based on these preferences: ${preferences.join(", ")}, recommend 4 relevant products from the inventory. 
          Return ONLY the JSON object containing the array of product IDs as specified.`;
          
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          
          try {
            const parsedResponse = JSON.parse(responseText);
            recommendedIds = parsedResponse.recommended_products || [];
          } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            // Try to extract JSON from text
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              try {
                const extractedJson = JSON.parse(jsonMatch[0]);
                recommendedIds = extractedJson.recommended_products || [];
              } catch (extractError) {
                console.error('Failed to extract JSON from Gemini response');
              }
            }
          }
        }
        
        // If we got valid recommendations, fetch those products
        if (recommendedIds && recommendedIds.length > 0) {
          const recommendedProducts = await Product.find({
            _id: { $in: recommendedIds }
          });
          
          // If we found recommended products, return them
          if (recommendedProducts.length > 0) {
            return res.json(recommendedProducts);
          }
        }
        
        // Fallback: if AI recommendations didn't work or returned no results, use keyword matching
      } catch (aiError) {
        console.error(`Error getting ${aiProvider.toUpperCase()} recommendations:`, aiError);
        // Continue with fallback recommendation logic
      }
    }
    
    // Fallback to keyword matching logic
    const lowercasePrefs = preferences.map(p => p.toLowerCase());
    
    // Get existing products
    const existingProducts = await Product.find();
    
    // If there are no existing products, create sample products
    if (existingProducts.length === 0) {
      await Product.insertMany(sampleIndianProducts);
      const newProducts = await Product.find();
      return res.json(newProducts);
    }
    
    // Enhanced matching algorithm
    const products = await Product.find({
      $or: [
        { name: { $regex: new RegExp(lowercasePrefs.join('|'), 'i') } },
        { description: { $regex: new RegExp(lowercasePrefs.join('|'), 'i') } },
        { category: { $regex: new RegExp(lowercasePrefs.join('|'), 'i') } }
      ]
    });
    
    if (products.length < 3) {
      // Not enough matches, create some sample products that match the preferences
      const preferenceCategories = {
        jewelry: [
          "Traditional Kundan Necklace", 
          "Meenakari Jhumka Earrings", 
          "Temple Jewelry Set", 
          "Silver Oxidized Bangles"
        ],
        necklace: [
          "Antique Pearl Necklace", 
          "Layered Gold Tone Necklace", 
          "Temple Jewelry Choker", 
          "Kundan Bridal Necklace"
        ],
        earring: [
          "Oxidized Jhumka Earrings", 
          "Pearl Drop Earrings", 
          "Gemstone Stud Earrings", 
          "Traditional Chandbali"
        ],
        bangle: [
          "Meenakari Bangle Set", 
          "Gold Plated Kada", 
          "Glass Stone Bangles", 
          "Silver Filigree Bracelet"
        ],
        beauty: [
          "Ayurvedic Face Mask", 
          "Kumkumadi Face Oil", 
          "Rose Water Toner", 
          "Saffron Night Cream"
        ],
        skincare: [
          "Turmeric Face Wash", 
          "Multani Mitti Clay Mask", 
          "Aloe Vera Gel", 
          "Sandalwood Face Pack"
        ],
        makeup: [
          "Traditional Kajal", 
          "Natural Sindoor", 
          "Ayurvedic Lip Tint", 
          "Herbal Kohl Pencil"
        ],
        haircare: [
          "Amla Hair Oil", 
          "Hibiscus Hair Mask", 
          "Bhringraj Hair Serum", 
          "Herbal Hair Conditioner"
        ]
      };
      
      // Add more Indian jewelry and beauty specific categories
      preferenceCategories.kundan = ["Kundan Choker Set", "Kundan Maang Tikka", "Kundan Stud Earrings", "Kundan Cocktail Ring"];
      preferenceCategories.meenakari = ["Meenakari Pendant Set", "Colorful Meenakari Earrings", "Meenakari Bangle Set", "Meenakari Anklets"];
      preferenceCategories.temple = ["Temple Jewelry Lakshmi Necklace", "Temple Jewelry Jhumkas", "Temple Style Hair Ornament", "Temple Jewelry Vanki"];
      preferenceCategories.ayurvedic = ["Ayurvedic Face Cream", "Herbal Body Scrub", "Ayurvedic Hair Oil", "Natural Lip Balm"];
      
      const newProducts = [];
      
      for (const pref of lowercasePrefs) {
        // Find which category this preference belongs to
        let category = pref;
        let productNames = [];
        
        for (const [cat, products] of Object.entries(preferenceCategories)) {
          if (pref.includes(cat)) {
            category = cat;
            productNames = products;
            break;
          }
        }
        
        // If no specific category matched, use a random one
        if (!productNames || productNames.length === 0) {
          const randomCat = Object.keys(preferenceCategories)[Math.floor(Math.random() * Object.keys(preferenceCategories).length)];
          category = randomCat;
          productNames = preferenceCategories[randomCat];
        }
        
        // Create a product based on the preference
        if (productNames && productNames.length > 0) {
          const randomIndex = Math.floor(Math.random() * productNames.length);
          const name = productNames[randomIndex];
          
          // Determine if it's jewelry or beauty based on category
          const isJewelry = ['jewelry', 'necklace', 'earring', 'bangle', 'kundan', 'meenakari', 'temple'].includes(category);
          const mainCategory = isJewelry ? 'jewelry' : 'beauty';
          
          const newProduct = new Product({
            name,
            description: `Premium Indian ${category} ${mainCategory === 'jewelry' ? 'piece' : 'product'} curated for your preferences`,
            image: `https://source.unsplash.com/random/300x300/?indian,${category},${mainCategory}`,
            price: (Math.random() * 2000 + 500).toFixed(0) * 1, // Price between 500-2500 INR
            category: mainCategory
          });
          
          await newProduct.save();
          newProducts.push(newProduct);
        }
      }
      
      // Return the newly created products
      return res.json(newProducts);
    }
    
    res.json(products);
  } catch (err) {
    console.error('Error getting recommendations:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
