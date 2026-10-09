import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleCheck,
  Clipboard,
  Gift,
  HeartHandshake,
  Leaf,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Quote,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import heroImage from "@/assets/kamdhenu-hero.jpg";
import nutsImage from "@/assets/nuts-collection.jpg";
import fruitsImage from "@/assets/fruits-makhana.jpg";
import seedsImage from "@/assets/seeds-collection.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  buildOrderSummary,
  formatRupees,
  formatWeight,
  lineTotal,
  PACKS,
  packTotal,
  PRESET_GRAMS,
  PRODUCTS,
  productById,
  type CartItem,
  type Product,
  type ProductCategory,
} from "@/lib/catalog";

const CART_KEY = "kamdhenu-cart-v1";
const WHATSAPP_NUMBER = "918585827649";
const ADDRESS =
  "Shib Dey Lane, Esplanade, Dharmatala, Taltala, Kolkata, West Bengal, 700016, India.";

type Filter = "all" | ProductCategory;

const navItems = [
  ["Shop", "#shop"],
  ["Value Club", "#value-club"],
  ["Our Story", "#story"],
  ["FAQs", "#faqs"],
] as const;

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Storefront() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [note, setNote] = useState("");
  const [bulkQuote, setBulkQuote] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch {
      window.localStorage.removeItem(CART_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = productById(item.productId);
        return sum + (product ? lineTotal(product.pricePerKg, item.grams) : 0);
      }, 0),
    [cart],
  );
  const count = cart.length;

  const addItems = (incoming: CartItem[], isBulk = false) => {
    setCart((current) => {
      const next = [...current];
      for (const item of incoming) {
        const existing = next.find((entry) => entry.productId === item.productId);
        if (existing) existing.grams += item.grams;
        else next.push({ ...item });
      }
      return next;
    });
    setBulkQuote(isBulk);
    toast.success(incoming.length > 1 ? "Pack added to your basket" : "Added to your basket");
  };

  const updateItem = (productId: string, grams: number) => {
    if (!Number.isFinite(grams) || grams < 50) return;
    setCart((current) =>
      current.map((item) => (item.productId === productId ? { ...item, grams } : item)),
    );
  };

  const removeItem = (productId: string) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
  };

  const chooseCategory = (next: Filter) => {
    setFilter(next);
    window.setTimeout(() => scrollTo("#shop"), 20);
  };

  const openBulkBuilder = () => {
    setBulkQuote(true);
    setFilter("all");
    scrollTo("#shop");
    toast.message("Choose any products and quantities for your quotation");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <TopBar />
      <Header
        count={count}
        onCart={() => setCartOpen(true)}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main>
        <Hero onShop={() => scrollTo("#shop")} onBuild={() => scrollTo("#value-club")} />
        <TrustStrip />
        <Categories onChoose={chooseCategory} onValue={() => scrollTo("#offers")} />
        <ProductCatalog filter={filter} setFilter={setFilter} addItems={addItems} />
        <ValueClub />
        <Offers addItems={addItems} openBulkBuilder={openBulkBuilder} />
        <WhyChoose />
        <Story />
        <HowItWorks onShop={() => scrollTo("#shop")} />
        <Support />
        <Faqs />
        <Contact onCart={() => setCartOpen(true)} />
      </main>

      <Footer />

      <Button
        className="fixed bottom-4 left-4 right-4 z-40 h-14 justify-between rounded-md px-5 shadow-2xl md:hidden"
        onClick={() => setCartOpen(true)}
      >
        <span className="flex items-center gap-2">
          <ShoppingBag /> Basket · {count} {count === 1 ? "item" : "items"}
        </span>
        <span>{formatRupees(subtotal)}</span>
      </Button>

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        subtotal={subtotal}
        note={note}
        setNote={setNote}
        bulkQuote={bulkQuote}
        setBulkQuote={setBulkQuote}
        updateItem={updateItem}
        removeItem={removeItem}
        clearCart={() => setCart([])}
      />
    </div>
  );
}

function TopBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground sm:text-sm">
      Premium Quality · Wholesale Prices
    </div>
  );
}

function BrandMark() {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Kamdhenu Enterprise home">
      <span className="grid size-10 place-items-center rounded-full border border-brand-gold/50 bg-secondary text-primary transition-transform group-hover:rotate-6">
        <Leaf className="size-5" />
      </span>
      <span>
        <span className="block font-display text-lg leading-none font-semibold">Kamdhenu</span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Enterprise
        </span>
      </span>
    </a>
  );
}

function Header({
  count,
  onCart,
  menuOpen,
  setMenuOpen,
}: {
  count: number;
  onCart: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-semibold text-foreground/75 transition-colors hover:text-primary"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onCart}
            className="relative size-11"
            aria-label={`Open basket with ${count} items`}
          >
            <ShoppingBag />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-gold-foreground">
                {count}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <Menu />
          </Button>
        </div>
      </div>
      {menuOpen && (
        <nav
          className="border-t border-border bg-background px-5 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-border py-3 font-semibold last:border-0"
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero({ onShop, onBuild }: { onShop: () => void; onBuild: () => void }) {
  return (
    <section
      id="top"
      className="relative min-h-180 overflow-hidden bg-secondary md:min-h-[calc(100vh-112px)]"
    >
      <img
        src={heroImage}
        alt="Premium dry fruits and superfoods arranged in ceramic bowls"
        width={1600}
        height={1200}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[66%_center]"
      />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative mx-auto flex min-h-180 max-w-7xl items-center px-5 py-16 md:min-h-[calc(100vh-112px)] lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="size-4 text-brand-gold" /> From growers to Kolkata families
          </p>
          <h1 className="max-w-xl font-display text-5xl leading-[0.98] font-semibold text-foreground sm:text-6xl lg:text-7xl">
            Premium goodness! <em className="font-normal text-primary">Prices that make sense.</em>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-foreground/75 sm:text-lg">
            Export-quality dry fruits and superfoods, sourced with care and offered at market-direct
            prices—right in the heart of Kolkata.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-13 px-7 text-base" onClick={onShop}>
              Shop All Products <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 border-foreground/25 bg-background/60 px-7 text-base backdrop-blur-sm"
              onClick={onBuild}
            >
              Build Your Family Basket
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-foreground/70">
            <span className="flex items-center gap-2">
              <CircleCheck className="size-4 text-primary" /> 8 Premium Essentials
            </span>
            <span className="flex items-center gap-2">
              <CircleCheck className="size-4 text-primary" /> Flexible Quantities
            </span>
            <span className="flex items-center gap-2">
              <CircleCheck className="size-4 text-primary" /> Clear Item-Wise Pricing
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-5 hidden border-l border-brand-gold/50 bg-background/90 px-6 py-4 backdrop-blur-sm lg:block">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Based In:
        </p>
        <p className="mt-1 font-display text-lg">Esplanade, Kolkata.</p>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    [Leaf, "Direct Sourcing", "Better value, fewer layers."],
    [PackageCheck, "Quality Focused", "Selected for taste & freshness."],
    [Users, "Family First", "Quantities that fit your home."],
    [HeartHandshake, "WhatsApp Support", "Human help before you order."],
  ] as const;
  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 lg:grid-cols-4 lg:px-8">
        {items.map(([Icon, title, text], index) => (
          <div
            key={title}
            className={`flex gap-3 py-6 ${index % 2 === 0 ? "pr-4" : "border-l border-border pl-4"} lg:border-l lg:px-6 first:lg:border-l-0`}
          >
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  center = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl leading-tight font-semibold sm:text-5xl">
        {title}
      </h2>
      {copy && <p className="mt-4 leading-7 text-muted-foreground">{copy}</p>}
    </div>
  );
}

function Categories({
  onChoose,
  onValue,
}: {
  onChoose: (filter: Filter) => void;
  onValue: () => void;
}) {
  const categories = [
    {
      title: "Dry Fruits & Nuts",
      copy: "Cashews, almonds & walnuts.",
      image: nutsImage,
      action: () => onChoose("nuts"),
    },
    {
      title: "Dried Fruits",
      copy: "Golden raisins & rich figs.",
      image: fruitsImage,
      action: () => onChoose("dried-fruits"),
    },
    {
      title: "Seeds & Superfoods",
      copy: "Chia, sunflower seeds & makhana.",
      image: seedsImage,
      action: () => onChoose("superfoods"),
    },
    {
      title: "Family Value Packs",
      copy: "Curated combinations made simple.",
      image: heroImage,
      action: onValue,
    },
  ];
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Explore The Collection"
          title="Shop by what your family loves!"
          copy="Start with a category or browse every product. You choose the quantity; the price updates automatically."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category.title}
              onClick={category.action}
              className="group relative aspect-4/5 overflow-hidden rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src={category.image}
                alt=""
                width={1200}
                height={1200}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-category-overlay" />
              <span className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                <span className="block font-display text-2xl font-semibold">{category.title}</span>
                <span className="mt-2 flex items-center justify-between text-sm text-primary-foreground/80">
                  {category.copy}
                  <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCatalog({
  filter,
  setFilter,
  addItems,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  addItems: (items: CartItem[]) => void;
}) {
  const visible =
    filter === "all" ? PRODUCTS : PRODUCTS.filter((product) => product.category === filter);
  const filters: [Filter, string][] = [
    ["all", "All Products"],
    ["nuts", "Nuts"],
    ["dried-fruits", "Dried Fruits"],
    ["superfoods", "Superfoods"],
  ];
  return (
    <section id="shop" className="scroll-mt-24 bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="The Complete Pantry"
            title="Premium Picks, Honest Prices!"
            copy="Every total is calculated directly from the listed per-kilogram rate! No hidden bundles or invented markdowns."
          />
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {filters.map(([value, label]) => (
              <Button
                key={value}
                variant={filter === value ? "default" : "outline"}
                className="shrink-0"
                onClick={() => setFilter(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addItem={(grams) => addItems([{ productId: product.id, grams }])}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, addItem }: { product: Product; addItem: (grams: number) => void }) {
  const [grams, setGrams] = useState(250);
  const [custom, setCustom] = useState(false);
  const valid = grams >= 50 && grams <= 10000;
  return (
    <article className="group overflow-hidden rounded-md border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-5/4 overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={`${product.name} in a ceramic bowl`}
          width={1200}
          height={1200}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: product.imagePosition }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur">
          Premium Selection
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold text-muted-foreground">{product.bengali}</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold">{product.name}</h3>
          <p className="shrink-0 text-right text-lg font-extrabold text-primary">
            {formatRupees(product.pricePerKg)}
            <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Per KG
            </span>
          </p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{product.note}</p>
        <div className="mt-5">
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Choose Quantity:
          </label>
          {custom ? (
            <div className="mt-2 flex gap-2">
              <Input
                type="number"
                min={50}
                max={10000}
                step={10}
                value={grams}
                onChange={(event) => setGrams(Number(event.target.value))}
                aria-label={`Custom grams for ${product.name}`}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setCustom(false);
                  setGrams(250);
                }}
                aria-label="Return to preset quantities"
              >
                <RotateCcw />
              </Button>
            </div>
          ) : (
            <select
              value={grams}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "custom") setCustom(true);
                else setGrams(Number(value));
              }}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Quantity for ${product.name}`}
            >
              {PRESET_GRAMS.map((amount) => (
                <option value={amount} key={amount}>
                  {formatWeight(amount)}
                </option>
              ))}
              <option value="custom">Custom Grams…</option>
            </select>
          )}
          {custom && !valid && (
            <p className="mt-1 text-xs text-destructive">Enter between 50 grams and 10 kilogram.</p>
          )}
        </div>
        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Your Price:
            </p>
            <p className="text-xl font-extrabold">
              {valid ? formatRupees(lineTotal(product.pricePerKg, grams)) : "—"}
            </p>
          </div>
          <Button onClick={() => addItem(grams)} disabled={!valid}>
            Add <Plus />
          </Button>
        </div>
      </div>
    </article>
  );
}

function ValueClub() {
  const benefits = [
    "Choose only the products your household uses.",
    "Start small or request pricing for larger quantities.",
    "Review every line item before you enquire.",
    "Repeat buying is simpler with your saved basket.",
  ];
  return (
    <section
      id="value-club"
      className="scroll-mt-24 bg-primary py-20 text-primary-foreground sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Kamdhenu Family Value Club
          </p>
          <h2 className="mt-4 font-display text-4xl leading-tight font-semibold sm:text-6xl">
            Your family. Your favorites. Your perfect basket.
          </h2>
          <p className="mt-6 max-w-xl leading-7 text-primary-foreground/75">
            A WhatsApp-first way to shop around your family’s tastes, needs and budget—with flexible
            quantities and clear per-kilogram pricing.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-md bg-primary-foreground/15 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <div key={benefit} className="bg-primary p-6 sm:p-8">
              <span className="grid size-9 place-items-center rounded-full bg-brand-gold text-sm font-extrabold text-brand-gold-foreground">
                0{index + 1}
              </span>
              <p className="mt-5 font-display text-xl leading-snug">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offers({
  addItems,
  openBulkBuilder,
}: {
  addItems: (items: CartItem[], isBulk?: boolean) => void;
  openBulkBuilder: () => void;
}) {
  return (
    <section id="offers" className="scroll-mt-24 bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          center
          eyebrow="Easy starting points"
          title="3 ways to bring goodness home &rarr;"
          copy="Start with a curated combination or create your own. Pack prices always follow the current catalog rates."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <OfferCard
            eyebrow="Entry Offer"
            title="Everyday Goodness Pack"
            description="An easy start for households making dry fruits part of the daily routine."
            items={["100 grams cashews.", "100 grams almonds.", "100 grams raisins."]}
            total={packTotal(PACKS.everyday)}
            cta="Add This Pack"
            onClick={() => addItems(PACKS.everyday)}
          />
          <OfferCard
            featured
            eyebrow="Family Favorite"
            title="Family Nutrition Mix"
            description="A broader four-product selection for everyday snacking, recipes and family meals."
            items={[
              "200 grams cashews.",
              "200 grams almonds.",
              "200 grams walnuts.",
              "200 grams raisins.",
            ]}
            total={packTotal(PACKS.family)}
            cta="Add Family Mix"
            onClick={() => addItems(PACKS.family)}
          />
          <OfferCard
            eyebrow="Festive & larger needs"
            title="Celebration & Bulk Basket"
            description="Choose across all eight products and request an item-wise quotation for your quantities."
            items={[
              "Your choice of products.",
              "Flexible quantities.",
              "Packaging subject to confirmation.",
            ]}
            cta="Build A Bulk Basket"
            onClick={openBulkBuilder}
          />
        </div>
      </div>
    </section>
  );
}

function OfferCard({
  eyebrow,
  title,
  description,
  items,
  total,
  cta,
  onClick,
  featured = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  total?: number;
  cta: string;
  onClick: () => void;
  featured?: boolean;
}) {
  return (
    <article
      className={`relative flex min-h-115 flex-col rounded-md border p-7 sm:p-8 ${featured ? "border-primary bg-primary text-primary-foreground shadow-card" : "border-border bg-card"}`}
    >
      {featured && (
        <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-brand-gold px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-gold-foreground">
          Most popular
        </span>
      )}
      <p
        className={`text-xs font-bold uppercase tracking-[0.16em] ${featured ? "text-brand-gold" : "text-primary"}`}
      >
        {eyebrow}
      </p>
      <h3 className="mt-4 font-display text-3xl font-semibold">{title}</h3>
      <p
        className={`mt-4 leading-7 ${featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}
      >
        {description}
      </p>
      <ul className="mt-7 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm font-semibold">
            <Check className={`size-5 shrink-0 ${featured ? "text-brand-gold" : "text-primary"}`} />
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        {typeof total === "number" && (
          <div className="mb-5">
            <p
              className={`text-xs font-bold uppercase tracking-[0.12em] ${featured ? "text-primary-foreground/60" : "text-muted-foreground"}`}
            >
              Indicative Total:
            </p>
            <p className="mt-1 text-3xl font-extrabold">{formatRupees(total)}</p>
          </div>
        )}
        <Button
          onClick={onClick}
          variant={featured ? "secondary" : "default"}
          className="h-12 w-full"
        >
          {cta}
          <ArrowRight />
        </Button>
      </div>
    </article>
  );
}

function WhyChoose() {
  const reasons = [
    [
      Sparkles,
      "Premium Selection",
      "A focused range chosen around freshness, taste and everyday usefulness.",
    ],
    [
      Leaf,
      "Market-Direct Value",
      "Direct sourcing helps reduce unnecessary layers between growers and families.",
    ],
    [
      PackageCheck,
      "Flexible Quantities",
      "Try smaller portions, stock family favorites, or plan a larger purchase.",
    ],
    [
      Quote,
      "Transparent Quotations",
      "See exact rates and item totals before sending your WhatsApp enquiry.",
    ],
    [
      Gift,
      "Made For Occasions",
      "Everyday nourishment, festive tables, gifting and family gatherings.",
    ],
    [
      HeartHandshake,
      "Attentive Service",
      "Talk directly with the business before finalizing payment or fulfilment.",
    ],
  ] as const;
  return (
    <section className="bg-sage py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Why Kamdhenu"
          title="Good food. Fair value. A relationship built on trust."
        />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(([Icon, title, copy]) => (
            <article key={title} className="border-t border-primary/25 pt-6">
              <Icon className="size-7 text-primary" />
              <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-foreground/65">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  const steps = [
    "Direct sourcing from growers.",
    "Quality-led product selection.",
    "Premium products at honest prices.",
    "A range for everyday and occasion needs.",
    "Serving Kolkata with value.",
    "Customer satisfaction at every step.",
  ];
  return (
    <section id="story" className="scroll-mt-24 bg-background py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-start lg:px-8">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow="Our story"
            title="Healthy living should feel accessible—not exclusive."
          />
          <p className="mt-6 leading-8 text-muted-foreground">
            From our home in Shib Dey Lane, Esplanade, we bring together a carefully selected
            collection of dry fruits and superfoods for Kolkata families. Our philosophy is simple:
            premium quality, honest value and a commitment to the people we serve.
          </p>
          <blockquote className="mt-8 border-l-2 border-brand-gold pl-6 font-display text-2xl italic leading-relaxed">
            “Premium Quality. Wholesale Prices.”
          </blockquote>
        </div>
        <div>
          <div className="overflow-hidden rounded-md">
            <img
              src={heroImage}
              alt="Kamdhenu Enterprise premium dry fruit collection"
              width={1600}
              height={1200}
              loading="lazy"
              className="aspect-16/10 w-full object-cover object-right"
            />
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Our Process &rarr;
          </p>
          <div className="mt-4 grid gap-px overflow-hidden rounded-md bg-border sm:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step} className="bg-secondary p-5">
                <span className="text-xs font-extrabold text-brand-gold">0{index + 1}</span>
                <p className="mt-2 font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ onShop }: { onShop: () => void }) {
  const steps = [
    ["01", "Explore Products", "Compare the range and clear per-kilogram prices."],
    ["02", "Choose Quantities", "Pick a preset or enter the exact grams your family needs."],
    ["03", "Review Your Basket", "Check every item, rate and estimated line total."],
    ["04", "Order On WhatsApp", "Send the prepared message and await business confirmation."],
  ] as const;
  return (
    <section className="bg-secondary py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Simple shopping"
            title="From pantry wish list to WhatsApp in 4 steps!"
          />
          <Button onClick={onShop}>
            Show All Products <ArrowRight />
          </Button>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {steps.map(([number, title, copy], index) => (
            <article key={number} className="relative border-t border-primary/30 pt-6">
              <span className="font-display text-4xl text-brand-gold">{number}</span>
              <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              {index < 3 && (
                <ChevronRight className="absolute -right-5 top-7 hidden size-5 text-primary/30 md:block" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Support() {
  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 md:flex-row md:items-center lg:px-8">
        <div className="flex max-w-3xl gap-5">
          <HeartHandshake className="mt-1 size-9 shrink-0 text-brand-gold" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
              Customer trust & support
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              Something not right with your order?
            </h2>
            <p className="mt-3 leading-7 text-primary-foreground/70">
              Contact us promptly on WhatsApp with your order details and clear photos of any
              damaged, incorrect or quality-concerned item. We’ll document the concern and confirm
              the available resolution after review.
            </p>
          </div>
        </div>
        <Button asChild variant="secondary" className="shrink-0">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello Kamdhenu Enterprise, I need help with an order concern.")}`}
            target="_blank"
            rel="noreferrer"
          >
            Message Support
          </a>
        </Button>
      </div>
    </section>
  );
}

function Faqs() {
  const faqs = [
    [
      "Are all eight products always available?",
      "Availability can change. Your WhatsApp enquiry is not a confirmed order; Kamdhenu Enterprise will confirm current stock before finalizing it.",
    ],
    [
      "How is the price for my quantity calculated?",
      "Each estimate is calculated proportionally from the displayed per-kilogram rate. For example, 250 g is one quarter of the listed kilogram price.",
    ],
    [
      "Can I choose a custom quantity?",
      "Yes. Select Custom grams on any product and enter a quantity from 50 g to 10 kg. Larger needs can be sent as a bulk quotation request.",
    ],
    [
      "Can I change a family pack?",
      "The curated packs are convenient starting points. For a different combination, add individual products and quantities to create your own basket.",
    ],
    [
      "How do bulk quotations work?",
      "Build your preferred basket and mark it as a celebration or bulk quotation in the cart. Any bulk rate, packaging or additional service is confirmed by the business.",
    ],
    [
      "Does clicking Order on WhatsApp place my order?",
      "No. WhatsApp opens with a prepared itemized message. You must send that message, then wait for the business to confirm availability, final pricing, payment and fulfilment.",
    ],
    [
      "Do you offer delivery or pickup?",
      "Delivery or pickup options, timing, coverage and any additional charges require confirmation by Kamdhenu Enterprise for each enquiry.",
    ],
  ];
  return (
    <section id="faqs" className="scroll-mt-24 bg-background py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
        <SectionHeading
          eyebrow="Questions Answered"
          title="Everything to know before you enquire!"
          copy="Clear expectations make for confident family shopping."
        />
        <Accordion type="single" collapsible className="border-t border-border">
          {faqs.map(([question, answer], index) => (
            <AccordionItem value={`faq-${index}`} key={question}>
              <AccordionTrigger className="py-5 text-base font-bold hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="max-w-2xl pb-5 leading-7 text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Contact({ onCart }: { onCart: () => void }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
  return (
    <section className="bg-secondary py-20">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div className="rounded-md bg-primary p-8 text-primary-foreground sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Visit or message us
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight font-semibold sm:text-5xl">
            Every family basket starts with a simple conversation.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-primary-foreground/70">
            Tell us what you need, review your item-wise estimate, and confirm the final details
            directly with Kamdhenu Enterprise.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button variant="whatsapp" size="lg" onClick={onCart}>
              Review Basket On WhatsApp <ArrowRight />
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                <MapPin /> Get Directions
              </a>
            </Button>
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-8">
          <BrandMark />
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                WhatsApp Number:
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-xl font-extrabold text-primary hover:underline"
              >
                (+91) 8585827649
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Store Address:
              </p>
              <p className="mt-2 leading-7">{ADDRESS}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground px-5 py-10 text-background">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm sm:flex-row sm:items-center">
        <p>Copyright © 2026 Kamdhenu Enterprise - All Rights Reserved!</p>
        <p className="text-background/60">
          Powered By <a href="https://nexadigitalservices.agency">Nexa</a>, A Digital Agency By{" "}
          <a href="https://www.linkedin.com/in/NitinChakraborty2001/">Nitin Chakraborty</a>.
        </p>
      </div>
    </footer>
  );
}

function CartDrawer({
  open,
  onOpenChange,
  cart,
  subtotal,
  note,
  setNote,
  bulkQuote,
  setBulkQuote,
  updateItem,
  removeItem,
  clearCart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  subtotal: number;
  note: string;
  setNote: (note: string) => void;
  bulkQuote: boolean;
  setBulkQuote: (value: boolean) => void;
  updateItem: (id: string, grams: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}) {
  const summary = buildOrderSummary(cart, note, bulkQuote);
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Order summary copied");
    } catch {
      toast.error("Could not copy automatically. Please select the summary manually.");
    }
  };
  const order = () => {
    if (cart.length === 0) {
      toast.error("Your basket is empty");
      return;
    }
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <span className="hidden" />
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-display text-2xl">Your family basket</SheetTitle>
          <SheetDescription>Review every item before opening WhatsApp.</SheetDescription>
        </SheetHeader>
        {cart.length === 0 ? (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-secondary text-primary">
                <ShoppingBag className="size-7" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold">Your basket is waiting</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Choose products and quantities to create an itemized order enquiry.
              </p>
              <SheetClose asChild>
                <Button className="mt-6" onClick={() => scrollTo("#shop")}>
                  Explore products
                </Button>
              </SheetClose>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                {cart.map((item) => {
                  const product = productById(item.productId);
                  if (!product) return null;
                  return (
                    <div
                      key={item.productId}
                      className="grid grid-cols-[64px_1fr_auto] gap-3 border-b border-border pb-4"
                    >
                      <img
                        src={product.image}
                        alt=""
                        width={1200}
                        height={1200}
                        className="size-16 rounded-md object-cover"
                        style={{ objectPosition: product.imagePosition }}
                      />
                      <div>
                        <p className="font-bold">
                          {product.name}{" "}
                          <span className="font-normal text-muted-foreground">
                            ({product.bengali})
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatRupees(product.pricePerKg)}/kg ·{" "}
                          {formatRupees(lineTotal(product.pricePerKg, item.grams))}
                        </p>
                        <div className="mt-2 flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() =>
                              updateItem(item.productId, Math.max(50, item.grams - 50))
                            }
                            aria-label={`Reduce ${product.name} by 50 grams`}
                          >
                            <Minus />
                          </Button>
                          <Input
                            type="number"
                            min={50}
                            max={10000}
                            step={10}
                            value={item.grams}
                            onChange={(event) =>
                              updateItem(item.productId, Number(event.target.value))
                            }
                            className="h-8 w-24 text-center"
                            aria-label={`${product.name} grams`}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() =>
                              updateItem(item.productId, Math.min(10000, item.grams + 50))
                            }
                            aria-label={`Increase ${product.name} by 50 grams`}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-md bg-secondary p-4">
                <input
                  type="checkbox"
                  checked={bulkQuote}
                  onChange={(event) => setBulkQuote(event.target.checked)}
                  className="mt-1 size-4 accent-primary"
                />
                <span>
                  <span className="block text-sm font-bold">Celebration or bulk quotation</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    Ask the business to confirm any applicable bulk pricing or packaging.
                  </span>
                </span>
              </label>
              <div className="mt-5">
                <label htmlFor="customer-note" className="text-sm font-bold">
                  Optional note
                </label>
                <Textarea
                  id="customer-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Gifting, preferred pickup, packaging enquiry…"
                  className="mt-2 min-h-20"
                />
              </div>
              <details className="mt-5 rounded-md border border-border p-4">
                <summary className="cursor-pointer text-sm font-bold">
                  View copyable order summary
                </summary>
                <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                  {summary}
                </pre>
              </details>
            </div>
            <div className="border-t border-border bg-background px-6 py-5">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Estimated grand total
                  </p>
                  <p className="mt-1 text-3xl font-extrabold">{formatRupees(subtotal)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  Clear basket
                </Button>
              </div>
              <Button variant="whatsapp" className="h-12 w-full text-base" onClick={order}>
                Order on WhatsApp <ArrowRight />
              </Button>
              <Button variant="outline" className="mt-2 h-11 w-full" onClick={copySummary}>
                <Clipboard /> Copy order summary
              </Button>
              <p className="mt-3 text-center text-[11px] leading-5 text-muted-foreground">
                WhatsApp will open with a prepared message. You must send it to submit your enquiry.
                Final availability, pricing, payment, and delivery or pickup require business
                confirmation.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
