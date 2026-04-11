"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

type LoginProps = {
	googleConfigured: boolean;
};

export default function Login({ googleConfigured }: LoginProps) {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#B5D2E6] px-4 py-10">
				<p className="text-lg font-semibold text-[#173B69]">Cargando...</p>
			</main>
		);
	}

	if (session?.user) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#B5D2E6] px-4 py-10">
				<section className="w-full max-w-[392px] rounded-[20px] bg-[#173B69] px-7 pb-7 pt-8 text-[#ECEDEF] shadow-[0_20px_45px_rgba(18,45,76,0.26)] sm:px-8">
					<p className="text-center text-2xl font-semibold">Bienvenido</p>
					<p className="mt-3 text-center text-base opacity-90">{session.user.name ?? session.user.email}</p>
					<Link
						href="/dashboard"
						className="mt-6 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-white text-lg font-semibold text-[#173B69] shadow-[0_7px_16px_rgba(10,25,44,0.2)] transition hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BFD3EA]"
					>
						Ir al dashboard
					</Link>
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: "/" })}
						className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#D2D3D5] text-xl font-semibold text-[#202226] shadow-[0_7px_16px_rgba(10,25,44,0.2)] transition hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BFD3EA]"
					>
						Cerrar sesion
					</button>
				</section>
			</main>
		);
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#B5D2E6] px-4 py-10">
			<section className="w-full max-w-[392px] rounded-[20px] bg-[#173B69] px-7 pb-7 pt-8 shadow-[0_20px_45px_rgba(18,45,76,0.26)] sm:px-8">
				<div className="mb-8 flex items-center justify-center rounded-2xl bg-[#ECEDEF] px-4 py-5 shadow-[0_8px_18px_rgba(9,24,44,0.16)]">
					<Image
						src="/LOGO-08.jpg"
						alt="Asociacion de Espina Bifida"
						width={255}
						height={130}
						className="h-auto w-[255px]"
					/>
				</div>

				<form
					className="space-y-5"
					aria-label="Formulario de inicio de sesion"
					onSubmit={(event) => event.preventDefault()}
				>
					<div className="space-y-2.5">
						<label
							htmlFor="usuario"
							className="block text-[20px] font-semibold leading-none tracking-tight text-[#BFD3EA]"
						>
							Usuario
						</label>
						<div className="flex h-14 items-center gap-3 rounded-[14px] bg-[#D9AE45] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								className="h-5 w-5 shrink-0 text-[#8B6A1A]"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M20 21a8 8 0 0 0-16 0" />
								<circle cx="12" cy="8" r="4" />
							</svg>
							<input
								id="usuario"
								type="text"
								placeholder="Ingresa tu usuario"
								className="h-full w-full bg-transparent text-[22px] text-[#2B2B2B] placeholder:text-[#B6851E] focus:outline-none"
								autoComplete="username"
							/>
						</div>
					</div>

					<div className="space-y-2.5">
						<label
							htmlFor="contrasena"
							className="block text-[20px] font-semibold leading-none tracking-tight text-[#BFD3EA]"
						>
							Contraseña
						</label>
						<div className="flex h-14 items-center gap-3 rounded-[14px] bg-[#D9AE45] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]">
							<svg
								aria-hidden="true"
								viewBox="0 0 24 24"
								className="h-5 w-5 shrink-0 text-[#8B6A1A]"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
								<path d="M7 11V7a5 5 0 0 1 10 0v4" />
							</svg>
							<input
								id="contrasena"
								type="password"
								placeholder="Ingresa tu contraseña"
								className="h-full w-full bg-transparent text-[22px] text-[#2B2B2B] placeholder:text-[#B6851E] focus:outline-none"
								autoComplete="current-password"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="mt-1 flex h-[58px] w-full items-center justify-center gap-3 rounded-[14px] bg-[#D2D3D5] text-[31px] font-semibold text-[#202226] shadow-[0_7px_16px_rgba(10,25,44,0.2)] transition hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BFD3EA]"
					>

						Iniciar Sesion
					</button>

					<button
						type="button"
						onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
						disabled={!googleConfigured}
						className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#BFD3EA] bg-white text-base font-semibold text-[#173B69] shadow-[0_6px_16px_rgba(10,25,44,0.16)] transition hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BFD3EA] disabled:cursor-not-allowed disabled:opacity-60"
					>
						<svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.67-2.26 1.07-3.72 1.07-2.86 0-5.28-1.93-6.15-4.52H2.18v2.84A11 11 0 0 0 12 23Z"
								fill="#34A853"
							/>
							<path
								d="M5.85 14.13a6.61 6.61 0 0 1 0-4.26V7.03H2.18a11 11 0 0 0 0 9.94l3.67-2.84Z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.35c1.61 0 3.06.55 4.2 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.03l3.67 2.84c.87-2.59 3.29-4.52 6.15-4.52Z"
								fill="#EA4335"
							/>
						</svg>
						Continuar con Google
					</button>
					{!googleConfigured ? (
						<p className="text-center text-xs font-medium text-[#BFD3EA]">
							Configura GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env.local
						</p>
					) : null}
				</form>
			</section>
		</main>
	);
}
