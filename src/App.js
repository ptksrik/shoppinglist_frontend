import { useState, useEffect } from 'react';
import './App.css';

const URL = 'http://localhost/shoppinglist/'

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetch(URL + 'retrieve.php')
      .then(response => response.json())
      .then(
        (response) => {
          setItems(response);
        }, (error) => {
          alert(error);
        }
      )
  }, [])

  function save(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'additem.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: item,
        amount: amount
      })
    })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            setItems(items => [...items, res]);
            setItem('');
            setAmount('');
          }
          else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
  }

  function removeItems(id) {

    let status = 0;

    fetch(URL + 'delete.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            const newListWithoutRemoved = items.filter((item) => item.id !== id);
            setItems(newListWithoutRemoved);
          }
          else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <h3>Shopping list</h3>
        <form onSubmit={save} className="form-group">
          <p>Add new item and amount of them in the shopping list.</p>

          <div className="row">
            <div className="col-sm-4">
              <label for="itemName">Item name</label>
            </div>

          </div>

          <div className="row">
            <div className="col-sm-4 mb-2">
              <input id="itemName" className="form-control shadow" type="text" value={item} onChange={e => setItem(e.target.value)} />
            </div>
            <div className="row">

              <div className="col-sm-4">
                <label for="itemAmount">Amount</label>
              </div>
            </div>
            <div className="col-sm-4 mb-2">
              <input id="itemAmount" className="form-control shadow" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="row">
              <div className="col-sm-4">
                <button className="btn btn-primary shadow">Save</button>
              </div>
            </div>
          </div>
        </form>

        <div className="row py-3">
          {items.map(item => (

            <div className="row" key={item.id}>
              <div className="col-sm-3">
                {item.description}
              </div>
              <div className="col-sm-2 mr-3">
                {item.amount}
              </div>

              <div className="col-sm-1">
                <button className=" btn btn-primary mb-1" onClick={() => removeItems(item.id)}>Delete</button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default App;
