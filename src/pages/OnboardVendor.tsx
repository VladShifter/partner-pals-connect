
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Building, Package, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OnboardVendor = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Step 1: Company info
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: First product
  const [productTitle, setProductTitle] = useState("");
  const [productNiche, setProductNiche] = useState("");
  const [productPitch, setProductPitch] = useState("");
  const [productDemo, setProductDemo] = useState("");
  const [productTags, setProductTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !productTags.includes(tagInput.trim())) {
      setProductTags([...productTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setProductTags(productTags.filter(tag => tag !== tagToRemove));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement Supabase vendor and product creation
    console.log("Vendor onboarding:", {
      website,
      description,
      product: {
        title: productTitle,
        niche: productNiche,
        pitch: productPitch,
        demo_url: productDemo,
        tags: productTags,
      }
    });

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to Rezollo!",
        description: "Your vendor account has been set up successfully.",
      });
      navigate("/dashboard/vendor");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Vendor Onboarding</h1>
            <div className="text-sm text-gray-600">Step {step} of 2</div>
          </div>
          <Progress value={(step / 2) * 100} className="h-2" />
        </div>

        {step === 1 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Company Information
              </CardTitle>
              <CardDescription>
                Tell us about your company and what you do
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your company does, your mission, and key offerings..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Your First Product
              </CardTitle>
              <CardDescription>
                Add your first product to start attracting partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-title">Product Title</Label>
                  <Input
                    id="product-title"
                    type="text"
                    placeholder="e.g., CRM Software for Small Businesses"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-niche">Niche/Category</Label>
                  <Input
                    id="product-niche"
                    type="text"
                    placeholder="e.g., SaaS, E-commerce, Marketing"
                    value={productNiche}
                    onChange={(e) => setProductNiche(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-pitch">Product Pitch</Label>
                  <Textarea
                    id="product-pitch"
                    placeholder="Describe your product, its benefits, and what makes it unique..."
                    value={productPitch}
                    onChange={(e) => setProductPitch(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-demo">Demo URL (Optional)</Label>
                  <Input
                    id="product-demo"
                    type="url"
                    placeholder="https://demo.yourproduct.com"
                    value={productDemo}
                    onChange={(e) => setProductDemo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {productTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Complete Setup"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardVendor;
