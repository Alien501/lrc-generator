import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/NavBar";
import TabContainer from "../components/TabContainer/TabContainer";
import TopBar from "../components/TopBar/TopBar";
import MusicBar from "../components/MusicBar/MusicBar";

const DefaultLayout = () => {
    return(
        <>
            <main className='font-satoshi bg-gray-300/4=0 min-h-screen'>
                <TopBar />
                <Navbar />
                <TabContainer>
                    <Outlet />
                </TabContainer>
                <MusicBar />
            </main>
        </>
    )
};

export default DefaultLayout;