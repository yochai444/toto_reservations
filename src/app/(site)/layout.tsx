import { CartDrawer } from "@/components/cart-drawer";
import { FloatingUI } from "@/components/floating-ui";
import { ItemSheet } from "@/components/item-sheet";
import { SearchDialog } from "@/components/search-dialog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store";
import { getMenu } from "@/lib/menu";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const menu = await getMenu();
  return (
    <StoreProvider menu={menu}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter categories={menu.categories} />
      <FloatingUI />
      <ItemSheet />
      <CartDrawer />
      <SearchDialog />
    </StoreProvider>
  );
}
