import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { tokenService } from "../../services/auth/tokenService";

export function useAuth() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = tokenService.getToken();
        const organization = tokenService.getOrganization();

        if (!token || !organization) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [router]);

    const selectProject = (projectId: string) => {
        tokenService.saveProjectId(projectId);
        router.push('/dashboard');
    };

    const logout = () => {
        tokenService.delete();
        router.push('/login');
    };

    return {
        isAuthenticated,
        isLoading,
        selectProject,
        logout
    };
}
