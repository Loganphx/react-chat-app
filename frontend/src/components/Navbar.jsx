import {useAuthStore} from "../store/useAuthStore.js";
import {MessageSquare, Settings, LogOut, User} from "lucide-react";
import {Link, useLocation} from "react-router-dom";

const Navbar = () => {
    const {logout, authUser} = useAuthStore();
    const location = useLocation();
    return (
        <header
            className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80"
            >
            <div className="px-4 h-16 12 w-full ">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary"/>
                            </div>
                            <h1 className="text-lg font-bold">Strife</h1>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            to={"/settings"}
                            className={`btn btn-sm gap-2 tranistion-colors
                            
                            `}
                        >
                            <Settings className="size-4"/>
                            <span className="hidden sm:inline">Settings</span>
                        </Link>
                        {authUser && (
                            <>
                                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                                    <User className="size-5"/>
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                <button className={"btn btn-sm gap-2 flex gap-2 items-center"} onClick={logout}>
                                    <LogOut className="size-5"/>
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                        {!authUser && location.pathname !== "/login" && <Link to={"/login"} className={`btn btn-sm gap-2`}>
                            <User className="size-5"/>
                            <span className="hidden sm:inline">Login</span>
                            </Link>}

                    </div>
                </div>
            </div>
        </header>
    )
}
export default Navbar;
