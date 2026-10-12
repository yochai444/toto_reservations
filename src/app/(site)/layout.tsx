import Box from "@mui/material/Box";
import { CartDrawer } from "@/components/cart-drawer";
import { FloatingUI } from "@/components/floating-ui";
import { ItemSheet } from "@/components/item-sheet";
import { SearchDialog } from "@/components/search-dialog";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store";
import { getMenu } from "@/lib/menu";

const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  const menu = await getMenu();
  return (
    <StoreProvider menu={menu}>
      <SiteHeader />
      <Box component="main" id="main" tabIndex={-1}>
        {children}
      </Box>
      <SiteFooter categories={menu.categories} />
      <FloatingUI />
      <ItemSheet />
      <CartDrawer />
      <SearchDialog />
    </StoreProvider>
  );
};

export default SiteLayout;
