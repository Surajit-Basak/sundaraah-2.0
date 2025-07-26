import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/data";

export const metadata = {
  title: "Shop | Sundaraah Showcase",
  description: "Explore our full collection of handcrafted jewelry.",
};

export default function ShopPage() {
  const products = getProducts();
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="bg-background">
      {/* Header Section */}
      <section className="bg-secondary py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Our Collection</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover pieces designed to be cherished, each with its own story.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-lg bg-secondary">
                <h2 className="font-headline text-2xl font-bold text-primary mb-6">Filter by</h2>
                <div>
                  <h3 className="font-headline text-lg font-semibold text-primary mb-4">Category</h3>
                  <ul className="space-y-2">
                    {categories.map(category => (
                        <li key={category}>
                            <a href="#" className="text-muted-foreground hover:text-primary">{category}</a>
                        </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
