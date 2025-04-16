"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        //clear smart session storage
        sessionStorage.clear();
        localStorage.clear(); 

        console.log("SMART session cleared.");
      } catch (err) {
        console.error("Error during logout:", err);
      } finally {
        router.push("/auth"); 
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
      Signing you out...
    </div>
  );
}
