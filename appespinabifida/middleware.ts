import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {


	return;
},{
	callbacks: {
		authorized: ({token, req}) => {
			if (!token) return false;

			if (req.nextUrl.pathname.startsWith("/inventory")){
				return token.role === "superadmin" || token.role === "CEO"
			}

			if (req.nextUrl.pathname.startsWith("/asociados")){
				return token.role === "superadmin" || token.role === "admin" || token.role === "secretaria"
			}

			if (req.nextUrl.pathname.startsWith("/servicios")){
				return token.role === "superadmin" || token.role === "admin" || token.role === "secretaria"
			}

			if (req.nextUrl.pathname.startsWith("/metricas")){
				return token.role === "superadmin" || token.role === "CEO"
			}

			if (req.nextUrl.pathname.startsWith("/nuevoUsuario")){
				return token.role === "superadmin"
			}

			if (req.nextUrl.pathname.startsWith("/recibos")){
				return token.role === "superadmin" || token.role === "admin" || token.role === "secretaria"
			}

			return true;
		}
	}
}
);

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/asociados/:path*",
		"/servicios/:path*",
		"/inventory/:path*",
		"/api/:path*"
	],
};
