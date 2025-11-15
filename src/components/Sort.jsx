function Sort({onSort}){
    return(
        <select aria-label="Sort Transactions" onChange={(e)=>{
            onSort(e.target.value)
        }}>
            <option value={"description"}>Description</option>
            <option value={"category"}>Category</option>
        </select>
    )
}
export default Sort