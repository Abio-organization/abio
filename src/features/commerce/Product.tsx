import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { mapProduct } from "@/features/store/catalog";
import { ProductModal } from "@/features/store/components/ProductModal";
import { CommerceLayout, Loading, ErrorBox } from "./ui";
import { useAuthStore } from "@/features/auth/store/auth-store";
export function ProductPage({
  slug,
  back = "/store",
}: {
  slug: string;
  back?: "/dashboard/store" | "/store" | "/";
}) {
  const navigate = useNavigate();
  const authenticated = useAuthStore((s) => s.isAuthenticated);
  const query = useQuery({
    queryKey: ["store", "product", slug],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get(
        "/astore/products/" + encodeURIComponent(slug),
        { signal },
      );
      return mapProduct(data.data);
    },
    retry: 1,
  });
  return (
    <CommerceLayout back={back} productDetail={authenticated}>
      <div className="mb-3 w-full border-b border-[#331400]/10 pb-3 dark:border-[#F5EEE4]/10">
        <h1 className="text-2xl font-bold text-[#331400] dark:text-[#F5EEE4]">
          All products
        </h1>
        <p className="mt-2 text-xs text-[#331400]/60 dark:text-[#F5EEE4]/60">
          <Link
            to={back}
            className="font-semibold text-[#331400] hover:underline dark:text-[#F5EEE4]"
          >
            All products33
          </Link>
          <span className="px-2">/</span>
          <span>{query.data?.name ?? slug}</span>
        </p>
      </div>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorBox
          message="This product is unavailable or could not be loaded."
          retry={() => void query.refetch()}
        />
      ) : (
        <ProductModal
          key={query.data.id}
          inline
          product={query.data}
          onClose={() => void navigate({ to: back })}
        />
      )}
    </CommerceLayout>
  );
}
