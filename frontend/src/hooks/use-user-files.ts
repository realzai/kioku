import { backend } from "@/lib/backend";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import type { UserFile } from "@/types/file.ts";

const fetchUserFiles = async (token: string): Promise<UserFile[]> => {
  const response = await backend.get("/files", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useUserFiles = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["userFiles"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }

      return fetchUserFiles(token);
    },
  });
};
