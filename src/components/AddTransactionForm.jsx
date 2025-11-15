import React, { useState } from "react";

function AddTransactionForm({postTransaction}) {
  const [formValues, setFormValues] = useState({
    date: "",
    description: "",
    category: "",
    amount: ""
  })

  function handleChange(e){
    const { name, value } = e.target
    setFormValues((prev)=>({
      ...prev,
      [name]: value
    }))
  }

  function submitForm(e){
    e.preventDefault()
    postTransaction(formValues)
    setFormValues({
      date: "",
      description: "",
      category: "",
      amount: ""
    })

  }

  return (
    <div className="ui segment">
      <form className="ui form" onSubmit={(e)=>{submitForm(e)}}>
        <div className="inline fields">
          <input type="date" name="date" aria-label="Date" value={formValues.date} onChange={handleChange}/>
          <input type="text" name="description" placeholder="Description" aria-label="Description" value={formValues.description} onChange={handleChange}/>
          <input type="text" name="category" placeholder="Category" aria-label="Category" value={formValues.category} onChange={handleChange}/>
          <input type="number" name="amount" placeholder="Amount" step="0.01" aria-label="Amount" value={formValues.amount} onChange={handleChange}/>
        </div>
        <button className="ui button" type="submit">
          Add Transaction
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
