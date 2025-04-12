import { backend } from "@/lib/backend";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import type { UserWebUrl } from "@/types/url.ts";

const fetchUserWebUrls = async (token: string): Promise<UserWebUrl[]> => {
  const response = await backend.get("/web_urls", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useWebUrls = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["webUrls"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }

      return fetchUserWebUrls(token);
    },
  });
};
