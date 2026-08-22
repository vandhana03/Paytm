import Appbar from "../components/appbar";
import Balance from "../components/balance";
import { Users } from "../components/users";
import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(
                    "https://paytm-y8gl.onrender.com/api/v1/account/balance",
                    {
                        headers: {
                            Authorization:
                                "Bearer " + localStorage.getItem("token"),
                        },
                    }
                );

                console.log("Balance response:", response.data);

                setBalance(response.data.balance);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        fetchBalance();
    }, []);

    return (
        <div>
            <Appbar />

            <div className="m-8">
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
};

export default Dashboard;