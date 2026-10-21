import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/NavBar";
import TabContainer from "../components/TabContainer/TabContainer";
// import TopBar from "../components/TopBar/TopBar";
import MusicBar from "../components/MusicBar/MusicBar";

const DefaultLayout = () => {
    return(
        <>
            <main className='font-display bg-gray-300/40 min-h-screen'>
                <header>
                    {/* <TopBar /> */}
                    <Navbar />
                </header>
                <section>
                    <TabContainer>
                        <Outlet />
                    </TabContainer>
                </section>
                <footer>
                    <MusicBar />
                </footer>
            </main>
        </>
    )
};

export default DefaultLayout;