import React, {useState, useEffect} from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions,setTransactions] = useState([])
  const [search,setSearch] = useState("")
  const [sortBy, setSortBy] = useState("description")
  const [fetchStatus, setFetchStatus] = useState("idle")
  const [fetchError, setFetchError] = useState("")
  const [actionState, setActionState] = useState({status: "idle", message: ""})

  useEffect(()=>{
    let isMounted = true
    setFetchStatus("loading")
    fetch("http://localhost:6001/transactions")
    .then(r=>{
      if(!r.ok){
        throw new Error("Network response was not ok")
      }
      return r.json()
    })
    .then(data=>{
      if(isMounted){
        setTransactions(data)
        setFetchStatus("success")
      }
    })
    .catch(()=>{
      if(isMounted){
        setFetchStatus("error")
        setFetchError("Unable to load transactions. Please try again later.")
      }
    })

    return ()=>{isMounted = false}
  },[])

  async function postTransaction(newTransaction){
    setActionState({status: "pending", message: ""})
    try{
      const response = await fetch('http://localhost:6001/transactions',{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTransaction)
      })
      if(!response.ok){
        throw new Error("Request failed")
      }
      const data = await response.json()
      setTransactions((prevTransactions)=>[...prevTransactions,data])
      setActionState({status: "success", message: "Transaction added successfully."})
    }catch(error){
      setActionState({status: "error", message: "Unable to save transaction. Please try again."})
    }
  }
  
  function onSort(selectedSortBy){
    setSortBy(selectedSortBy)
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filteredTransactions = transactions.filter((transaction)=>{
    if(!normalizedSearch) return true
    const haystack = `${transaction.description ?? ""} ${transaction.category ?? ""}`.toLowerCase()
    return haystack.includes(normalizedSearch)
  })

  const sortedTransactions = [...filteredTransactions].sort((a,b)=>{
    const aValue = String(a[sortBy] ?? "").toLowerCase()
    const bValue = String(b[sortBy] ?? "").toLowerCase()
    return aValue.localeCompare(bValue)
  })

  const showEmptyState = fetchStatus === "success" && transactions.length === 0
  const showSearchEmptyState = fetchStatus === "success" && transactions.length > 0 && sortedTransactions.length === 0

  return (
    <div>
      <Search setSearch={setSearch}/>
      <AddTransactionForm postTransaction={postTransaction}/>
      <Sort onSort={onSort}/>

      {fetchStatus === "loading" && (
        <p role="status">Loading transactions...</p>
      )}
      {fetchStatus === "error" && (
        <p role="alert">{fetchError}</p>
      )}
      {actionState.status === "error" && (
        <p role="alert">{actionState.message}</p>
      )}
      {actionState.status === "success" && (
        <p role="status">{actionState.message}</p>
      )}
      {showEmptyState && (
        <p role="note">No transactions available. Add your first transaction.</p>
      )}
      {showSearchEmptyState && (
        <p role="note">No transactions match your search.</p>
      )}

      {sortedTransactions.length > 0 && <TransactionsList transactions={sortedTransactions} />}
    </div>
  );
}

export default AccountContainer;
