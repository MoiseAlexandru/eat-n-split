import { useState } from "react";

const initialFriends = [
    {
      id: 118836,
      name: "Clark",
      image: "https://i.pravatar.cc/48?u=118836",
      balance: -7,
    },
    {
      id: 933372,
      name: "Sarah",
      image: "https://i.pravatar.cc/48?u=933372",
      balance: 20,
    },
    {
      id: 499476,
      name: "Anthony",
      image: "https://i.pravatar.cc/48?u=499476",
      balance: 0,
    },
  ];


function Friend({friend, onSelection, selectedFriend}) {

    const isSelected = friend.id === selectedFriend?.id;

    return (
        <div>
            <li className = {isSelected ? "selected" : ""}>
                <img src = {friend.image} alt = {friend.name} />
                <h3> {friend.name} </h3>

                {friend.balance < 0 && (
                    <p className = "red"> You owe {friend.name} {Math.abs(friend.balance)}$ </p>
                )}
                {friend.balance === 0 && (
                    <p> You and your friend are even </p>
                )}  
                {friend.balance > 0 && (
                    <p className = "green"> {friend.name} owes you {friend.balance}$ </p>
                )}

                <Button onClick = {() => onSelection(friend)}> {isSelected ? "Close" : "Select"} </Button>
            </li>
        </div>
    )
}

function Button({children, onClick}) {
    return (
        <button className = "button" onClick = {onClick}> {children} </button>
    )
}

function FriendsList({friends, onSelection, selectedFriend}) {

    return (
        <ul>
            {friends.map((friend) => (
                <Friend friend = {friend} key = {friend.id} onSelection = {onSelection} selectedFriend = {selectedFriend}/>
            ))}
        </ul>
    );
}

function FormAddFriend({onAddFriend}) {

    const [name, setName] = useState("");
    const [image, setImage] = useState("https://i.pravatar.cc/48");

    function handleSubmit(e) {
        e.preventDefault();
    
        if(!name || !image)
            return;

        const id = crypto.randomUUID();
        const newFriend = {
            id,
            name,
            image: `${image}?=${id}`, 
            balance: 0
        }

        onAddFriend(newFriend);

        setName("");
        setImage("https://i.pravatar.cc/48");
    }

    return (
        <form className = "form-add-friend" onSubmit = {handleSubmit}>
            <label> * Friend name </label>
            <input type = "text" value = {name} onChange = {(e) => setName(e.target.value)} />

            <label> * Image URL </label>
            <input type = "text" value = {image} onChange = {(e) => setImmediate(e.target.value)} />

            <Button> Add </Button>
        </form>
    )
}

function FormSplitBill({selectedFriend, onSplitBill}) {

    const [bill, setBill] = useState("");
    const [paidByUser, setPaidByUser] = useState("");
    const paidByFriend = bill ? bill - paidByUser : "";
    const [whoIsPaying, setWhoIsPaying] = useState("user");

    function handleUserPayment(e) {
        const amount = Number(e.target.value);
        if(amount > bill)
            setPaidByUser(paidByUser);
        else
            setPaidByUser(amount);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if(!bill || !paidByUser)
            return;
        onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
    }

    return (
        <form className = "form-split-bill" onSubmit = {handleSubmit}> 
            <h2> Split a bill with {selectedFriend.name} </h2>

            <label> 💰 Bill value </label>
            <input type = "text" value = {bill} onChange = {(e) => setBill(Number(e.target.value))} />

            <label> 👨‍🦱 Your expense </label>
            <input type = "text" value = {paidByUser} onChange = {(e) => handleUserPayment(e)} />

            <label> 🤵 X's expense </label>
            <input type = "text" value = {paidByFriend} disabled/>

            <label> 🤑 Who's' paying the bill? </label>
            <select value = {whoIsPaying} onChange = {(e) => setWhoIsPaying(e.target.value)}>
                <option value = "user"> You </option>
                <option value = "friend"> {selectedFriend.name} </option>
            </select>
           

            <Button> Split bill </Button>
        </form>
    )
}

function App() {

    const [friends, setFriends] = useState(initialFriends);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    function handleShowAddFriend() {
        setShowAddFriend((show) => !show);
    }

    function handleAddFriend(friend) {
        setFriends((friends) => [...friends, friend]);
        setShowAddFriend(false);
    }

    function handleSelection(friend) {
        setSelectedFriend((cur) => cur?.id === friend.id ? null : friend);
        setShowAddFriend(false);
    }

    function handleSplitBill(value) {
        setFriends((friends) => friends.map(friend => ({...friend, balance: friend.id === selectedFriend.id ? friend.balance + value : friend.balance})));
        setSelectedFriend(null);
    }

    return (
        <div className = "app">
            <div className = "sidebar">
                <FriendsList friends = {friends} selectedFriend = {selectedFriend} onSelection = {handleSelection}/>
                {showAddFriend && <FormAddFriend onAddFriend = {handleAddFriend}/>}
                <Button onClick = {handleShowAddFriend}> {showAddFriend ? "Close" : "Add friend"} </Button>
            </div>
            {selectedFriend && <FormSplitBill selectedFriend = {selectedFriend} onSplitBill = {handleSplitBill} key = {selectedFriend.id}/>}
        </div>
    );
}

export default App;
