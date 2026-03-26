export default function Login() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#B5D2E6] px-4 py-10">
			<section className="w-full max-w-[392px] rounded-[20px] bg-[#173B69] px-7 pb-7 pt-8 shadow-[0_20px_45px_rgba(18,45,76,0.26)] sm:px-8">
				<div className="mb-8 flex items-center justify-center rounded-2xl bg-[#ECEDEF] px-4 py-5 shadow-[0_8px_18px_rgba(9,24,44,0.16)]">
					<img
						src="/LOGO-08.jpg"
						alt="Asociacion de Espina Bifida"
						width={255}
						height={130}
						className="h-auto w-[255px]"
					/>
				</div>

				<form className="space-y-5" aria-label="Formulario de inicio de sesion">
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
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							className="h-7 w-7"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.4"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M5 12h14" />
							<path d="M12 5l7 7-7 7" />
							<path d="M5 5v14" />
						</svg>
						Iniciar Sesion
					</button>
				</form>
			</section>
		</main>
	);
}
