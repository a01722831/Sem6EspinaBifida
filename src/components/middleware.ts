import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware() {
	return;
});

export const config = {
	matcher: ["/dashboard/:path*"],
};
