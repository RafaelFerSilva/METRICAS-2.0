import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { tokenService } from '../services/auth/tokenService'

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        try {
            tokenService.delete()
            router.push('/')
        } catch (error) {
            alert(error.message );
        }
    }, [router]);

    return (
        <div>
            Você será redirecionado em instantes
        </div>
    )
}