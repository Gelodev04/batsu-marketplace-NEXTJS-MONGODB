import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Product } from "@/types";


export type GetMyProductsResponse = { products: Product[] };

export function useMyProducts() {
  return useSWR<GetMyProductsResponse>("/api/products", fetcher, {
    revalidateOnFocus: false,
  });
}