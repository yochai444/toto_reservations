import { moveCategory, moveItem, setItemAvailable } from "@/app/admin/actions";
import {
  ArrowButton,
  AvailableToggle,
  Categories,
  CategoryActions,
  CategoryCard,
  CategoryHead,
  EditLink,
  HiddenTag,
  ItemList,
  ItemName,
  ItemRow,
  ItemThumb,
  OutlineLink,
  PageHead,
  PinkLink,
  UnderlineLink,
} from "@/components/admin/admin-styles";
import { Notice } from "@/components/ui/form";
import { Muted, Price } from "@/components/ui/primitives";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMenu } from "@/lib/admin-menu";
import { formatILS } from "@/lib/pricing";

function MoveButtons({ action, id, first, last, label }: { action: (fd: FormData) => Promise<void>; id: string; first: boolean; last: boolean; label: string }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {([-1, 1] as const).map((dir) => (
        <form key={dir} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="dir" value={dir} />
          <ArrowButton type="submit" disabled={dir === -1 ? first : last} aria-label={`${dir === -1 ? "הזזה למעלה" : "הזזה למטה"}: ${label}`}>
            {dir === -1 ? "↑" : "↓"}
          </ArrowButton>
        </form>
      ))}
    </div>
  );
}

export default async function AdminMenuPage({ searchParams }: PageProps<"/admin">) {
  const { saved } = await searchParams;
  const { db } = await requireAdmin();
  const { categories, items, optionGroups } = await getAdminMenu(db);

  return (
    <>
      <PageHead>
        <div>
          <h1>התפריט</h1>
          <p>
            {items.length} מנות · {items.filter((i) => !i.available).length} מוסתרות · שינויים מופיעים באתר מיד
          </p>
        </div>
        <OutlineLink href="/admin/categories/new">+ קטגוריה חדשה</OutlineLink>
      </PageHead>

      {saved && (
        <Notice tone="ok" sx={{ mb: 2.5, px: 2 }}>
          נשמר. השינוי כבר באתר.
        </Notice>
      )}

      <Categories>
        {categories.map((c, ci) => {
          const catItems = items.filter((i) => i.category_id === c.id);
          return (
            <CategoryCard key={c.id} id={`cat-${c.id}`}>
              <CategoryHead>
                <MoveButtons action={moveCategory} id={c.id} first={ci === 0} last={ci === categories.length - 1} label={c.name} />
                <h2>{c.name}</h2>
                {!c.visible && <HiddenTag>מוסתרת מהאתר</HiddenTag>}
                <span className="note">{c.note}</span>
                <CategoryActions>
                  <UnderlineLink href={`/admin/categories/${c.id}`}>עריכת קטגוריה</UnderlineLink>
                  <PinkLink href={`/admin/items/new?category=${c.id}`}>+ מנה</PinkLink>
                </CategoryActions>
              </CategoryHead>

              {catItems.length === 0 ? (
                <Muted sx={{ py: 2 }}>אין עדיין מנות בקטגוריה הזו.</Muted>
              ) : (
                <ItemList>
                  {catItems.map((it, i) => (
                    <ItemRow key={it.id} dim={!it.available}>
                      <MoveButtons action={moveItem} id={it.id} first={i === 0} last={i === catItems.length - 1} label={it.name} />
                      <ItemThumb src={it.image || "/img/crown.png"} alt="" width={56} height={56} />
                      <ItemName href={`/admin/items/${it.id}`}>
                        <b>{it.name}</b>
                        <span>
                          {[it.unit, it.option_group_id && optionGroups.find((g) => g.id === it.option_group_id)?.legend, it.badge].filter(Boolean).join(" · ")}
                        </span>
                      </ItemName>
                      <Price>{formatILS(it.price)}</Price>
                      <form action={setItemAvailable}>
                        <input type="hidden" name="id" value={it.id} />
                        <input type="hidden" name="available" value={String(!it.available)} />
                        <AvailableToggle type="submit" on={it.available} aria-label={`${it.available ? "הסתרת" : "הצגת"} ${it.name}`}>
                          {it.available ? "מוצג באתר" : "מוסתר"}
                        </AvailableToggle>
                      </form>
                      <EditLink href={`/admin/items/${it.id}`}>עריכה</EditLink>
                    </ItemRow>
                  ))}
                </ItemList>
              )}
            </CategoryCard>
          );
        })}
      </Categories>
    </>
  );
}
