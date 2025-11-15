import React, {useState, useEffect} from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions,setTransactions] = useState([])
  const [search,setSearch] = useState("")
  const [sortBy, setSortBy] = useState("description")
  // console.log(search)

  useEffect(()=>{
    fetch("http://localhost:6001/transactions")
    .then(r=>r.json())
    .then(data=>setTransactions(data))
  },[])

  function postTransaction(newTransaction){
    fetch('http://localhost:6001/transactions',{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTransaction)
    })
    .then(r=>r.json())
    .then(data=>setTransactions((prevTransactions)=>[...prevTransactions,data]))
  }
  
  // Sort function here
  function onSort(selectedSortBy){
    setSortBy(selectedSortBy)
  }

  // Filter using search here and pass new variable down
  const normalizedSearch = search.trim().toLowerCase()
  const filteredTransactions = transactions.filter((transaction)=>{
    if(!normalizedSearch) return true
    return transaction.description.toLowerCase().includes(normalizedSearch)
  })

  const sortedTransactions = [...filteredTransactions].sort((a,b)=>{
    const aValue = String(a[sortBy] ?? "").toLowerCase()
    const bValue = String(b[sortBy] ?? "").toLowerCase()
    return aValue.localeCompare(bValue)
  })

  return (
    <div>
      <Search setSearch={setSearch}/>
      <AddTransactionForm postTransaction={postTransaction}/>
      <Sort onSort={onSort}/>
      <TransactionsList transactions={sortedTransactions} />
    </div>
  );
}

export default AccountContainer;
