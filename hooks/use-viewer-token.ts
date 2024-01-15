import { toast } from "sonner";
import { useEffect, useState } from "react";

import { createViewerToken } from "@/actions/token";
import { JwtPayload, jwtDecode } from "jwt-decode";

export const useViewerToken = (hostIdentity: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [identity, setIdentity] = useState<string | null>(null);

  useEffect(() => {
    const createToken = async () => {
      try {
        const viewerToken = await createViewerToken(hostIdentity);
        setToken(viewerToken);
        const decodedToken = jwtDecode<JwtPayload & { name?: string }>(
          viewerToken
        );
        const name = decodedToken?.name;
        const identity = decodedToken.jti;

        if (identity) {
          setIdentity(identity);
        }
        if (name) {
          setName(name);
        }
      } catch {
        toast.error("Unable to create viewer token");
      }
    };
    createToken();
  }, [hostIdentity]);
  return {
    token,
    name,
    identity,
  };
};
