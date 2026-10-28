"use client";
import {useState} from 'react'
import { useSession } from "next-auth/react"

const enum TransactionType {
    NONE = "none",
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal"
}
const Dashboard = () => {
    const { data: session } = useSession()
    const [showModal, setShowModal] = useState<TransactionType>(TransactionType.NONE);
    if (!session?.user) {
        return (
            "Not signed in. <a href='/sign-in'>Sign in</a>"
        )
    }
  return (
    <div>Dashboard
        <button onClick={() => setShowModal(TransactionType.DEPOSIT)}>Add Money</button>
        <button onClick={() => setShowModal(TransactionType.WITHDRAWAL)}>Withdraw Money</button>
        <TransactionModal type={showModal} />
    </div>
  )
}
const TransactionModal = ({type}: {type: TransactionType}) => {
    if (type === TransactionType.NONE) {
        return null;
    }
    const handleFormAction = (formData: FormData)=>{
        const amountValue = formData.get("amount"); 

    alert(`Submitting ${type} form with amount: ${amountValue}`);
    }
    //for now no withdrawal alllowed
    if (type === TransactionType.WITHDRAWAL) {
        return (
            <div>
                <h2>Withdraw Money</h2>
                <p>Withdrawals are not allowed at this time.</p>
            </div>
        )
    }
    return (
        <div>
            <h2>
                {type === TransactionType.DEPOSIT && "Deposit Money" } 
                {/* {type === TransactionType.WITHDRAWAL && "Withdraw Money"} */}
            </h2>
            <form action={handleFormAction}>
                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" name="amount" />
                <button type="submit">
                    {type === TransactionType.DEPOSIT && "Deposit"}
                    {/* {type === TransactionType.WITHDRAWAL && "Withdraw"} */}
                </button>
            </form>
        </div>
    )
}
export default Dashboard