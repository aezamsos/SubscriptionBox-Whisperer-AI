
import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Check, ShoppingBag, Heart, Box, MessageSquare, Sparkles, IndianRupee, Diamond, Gem } from "lucide-react";
import { CURRENCY_SYMBOL } from "@/services/apiService";

const Index: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary/30 py-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter mb-4">
                Your Perfect <span className="text-brand">Subscription Box</span>,
                <br /> Tailored by AI
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0 mb-8">
                Experience the finest Indian jewelry and beauty products, curated by AI 
                just for you. Premium selection delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/create">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Your Box
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="bg-brand/10 border border-brand/20 rounded-lg p-6 relative">
                <div className="absolute -top-3 -left-3">
                  <Diamond className="h-12 w-12 text-brand p-2 bg-background rounded-lg shadow-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Kundan Necklace", price: "4,999", category: "Jewelry" },
                    { name: "Ayurvedic Face Pack", price: "1,299", category: "Beauty" },
                    { name: "Jhumka Earrings", price: "2,499", category: "Jewelry" },
                    { name: "Rose Water Toner", price: "899", category: "Skincare" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="bg-card shadow-md rounded-md p-4 flex flex-col justify-center animate-float"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="mb-2 text-xs text-muted-foreground">{item.category}</div>
                      <div className="font-medium text-sm mb-1 line-clamp-2">{item.name}</div>
                      <div className="text-brand font-bold flex items-center text-sm">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-background rounded-md border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-brand" />
                    <span className="text-sm font-medium">BoxWhisperer AI</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on your love for traditional jewelry and natural skincare, I've curated this box with authentic Indian products I think you'll cherish!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            The Smarter Way to Subscribe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-lg p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-brand" />
              </div>
              <h3 className="font-bold text-xl mb-2">AI-Powered Curation</h3>
              <p className="text-muted-foreground">
                Chat with our AI to discover premium Indian jewelry and beauty products matched to your style.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-brand" />
              </div>
              <h3 className="font-bold text-xl mb-2">Authentic Indian Products</h3>
              <p className="text-muted-foreground">
                Curated selection of genuine Indian jewelry, cosmetics, and ayurvedic beauty products.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center">
                <Box className="h-6 w-6 text-brand" />
              </div>
              <h3 className="font-bold text-xl mb-2">Flexible Subscriptions</h3>
              <p className="text-muted-foreground">
                Choose monthly, bi-monthly, or quarterly deliveries with free shipping across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Boxes Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Example Subscription Boxes</h2>
          <p className="text-center text-muted-foreground max-w-[700px] mx-auto mb-12">
            Preview what your personalized box might look like after signing up
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Bridal Jewelry Collection",
                items: [
                  "Gold-plated Kundan Set",
                  "Traditional Jhumkas",
                  "Pearl Maang Tikka",
                  "Bangles Set (2 pairs)"
                ],
                price: "5,499"
              },
              {
                name: "Premium Beauty Box",
                items: [
                  "Forest Essentials Face Scrub",
                  "Kama Ayurveda Hair Oil",
                  "Biotique Bio Cucumber Toner",
                  "Himalaya Herbals Face Pack"
                ],
                price: "3,299"
              },
              {
                name: "Everyday Elegance",
                items: [
                  "Silver Oxidized Earrings",
                  "Beaded Bracelet Set",
                  "Lakme 9to5 Lipstick",
                  "Lotus Herbals Sunscreen"
                ],
                price: "2,799"
              }
            ].map((box, i) => (
              <div key={i} className="bg-card border rounded-lg overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-brand/20 to-brand/5 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-background flex items-center justify-center shadow-lg">
                    {i === 0 ? (
                      <Diamond className="h-10 w-10 text-brand" />
                    ) : i === 1 ? (
                      <Sparkles className="h-10 w-10 text-brand" />
                    ) : (
                      <Gem className="h-10 w-10 text-brand" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{box.name}</h3>
                  <ul className="mb-4 space-y-2">
                    {box.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold">{CURRENCY_SYMBOL}{box.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">/ month</span>
                    </div>
                    <Link to="/login">
                      <Button variant="outline" size="sm">Preview</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground max-w-[600px] mx-auto mb-12">
            Creating your personalized subscription box is simple with our three-step process
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Chat with AI",
                description: "Tell our AI about your preferences, jewelry style, and beauty products you enjoy.",
              },
              {
                step: "2",
                title: "Customize Your Box",
                description: "Review AI recommendations and refine your box until it perfectly matches your style.",
              },
              {
                step: "3",
                title: "Enjoy Your Delivery",
                description: "Receive your personalized box with authentic Indian jewelry and beauty products.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-card border rounded-lg p-6 h-full">
                  <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-brand flex items-center justify-center text-primary-foreground font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-xl mb-2 mt-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/create">
              <Button size="lg">Start Creating Your Box</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Subscribers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The jewelry selection perfectly matches my traditional style. I wear something from my box at every function!",
                author: "Priya S., Mumbai",
              },
              {
                quote: "I'm amazed at how well the AI understood my skincare needs. The ayurvedic products are perfect for my sensitive skin.",
                author: "Arjun T., Bangalore",
              },
              {
                quote: "BoxWhisperer saved me so much time searching for authentic products. The jewelry pieces are exquisite!",
                author: "Kavita M., Delhi",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-card border rounded-lg p-6">
                <div className="mb-4 text-brand">
                  {Array(5).fill(0).map((_, i) => (
                    <Sparkles key={i} className="h-4 w-4 inline-block mr-1" />
                  ))}
                </div>
                <p className="italic mb-4">{testimonial.quote}</p>
                <p className="font-medium">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-brand/5">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to experience authentic Indian products?</h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
            Join thousands of happy subscribers who look forward to their personalized box of premium Indian jewelry and beauty products every month.
          </p>
          <Link to="/create">
            <Button size="lg" className="animate-pulse">
              Create Your Box Now
            </Button>
          </Link>
        </div>
      </section>
    </PageContainer>
  );
};

export default Index;
