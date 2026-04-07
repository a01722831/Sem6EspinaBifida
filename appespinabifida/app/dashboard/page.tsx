import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth-options";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect("/");
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#B5D2E6] px-4 py-10">
			<section className="w-full max-w-[540px] rounded-[20px] bg-[#173B69] px-7 pb-8 pt-8 text-[#ECEDEF] shadow-[0_20px_45px_rgba(18,45,76,0.26)] sm:px-9">
				<h1 className="text-center text-3xl font-semibold">Dashboard</h1>
				<p className="mt-4 text-center text-lg opacity-95">Autenticacion verificada correctamente.</p>
				<p className="mt-2 text-center text-sm opacity-85">Usuario: {session.user?.email ?? session.user?.name}</p>
				<div className="mt-7 flex justify-center">
					<Link
						href="/"
						className="rounded-[14px] bg-[#D2D3D5] px-6 py-3 text-base font-semibold text-[#202226] shadow-[0_7px_16px_rgba(10,25,44,0.2)] transition hover:brightness-[0.98]"
					>
						Volver al login
					</Link>
				</div>
			</section>
		</main>
	);
}
