import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
const list = [
    {
        title: 'React',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'React1',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 1,
    },
    {
        title: 'deact2',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 3,
    }
];
const DEFAULT_HPP = '100';
const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

function isSearched(searchTerm) {
    return function(item) {
        return item.title ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) : '';
    }
}
class Button extends Component {
    render() {
        const { onClick, className = '', children} = this.props;
        return (
            <button onClick={onClick} className={className} type="button">
                {children}
            </button>
        );
    }
}
const Search = ({ value, onChange, children, onSubmit }) =>
    <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange}/>
        <button type="submit">
            {children}
        </button>
    </form>
// class Search extends Component {
//     constructor(prop) {
//         console.log('Search==>', prop)
//         super(prop);
//     }
//     render() {
//         const { value, onChange, children } = this.props;
//         return (
//             <form>
//                 {children}
//                 <input type="text" value={value} onChange={onChange}/>
//             </form>
//         );
//     }
// }

class Table extends Component {
    constructor(props) {
        console.log('table==>')
        super(props);
    }

    render() {
        console.log('tableRender==>')

        const largeColumn = { width: '40%',
        };
        const midColumn = { width: '30%',
        };
        const smallColumn = { width: '10%',
        };
        const { list, pattern, onDismiss } = this.props;
        return (
            <div className="table">
                {list.map(item =>
                    <div key={item.objectID} className="table-row">
                        <span style={largeColumn}>
                          <a href={item.url}>{item.title}</a>
                        </span>
                        <span style={midColumn}>{item.author}</span>
                        <span style={smallColumn}>{item.num_comments}</span>
                        <span style={smallColumn}>{item.points}</span>
                        <span style={smallColumn}>
                            <Button onClick={() => onDismiss(item.objectID)}> Dismiss </Button>
                        </span>
                    </div>
                )}
            </div>
        );
    }
}



class App extends Component {
    constructor(props) {
        console.log('App===>')
        super(props);

        this.state = {
            list,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            result: null,
            error: null
        };
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.onClickMe = this.onClickMe.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }

    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    onSearchSubmit(event) {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
        event.preventDefault();
    }


    setSearchTopStories(result) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;
        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];
        const updatedHits = [
            ...oldHits,
            ...hits
        ];
        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        });
    }
    fetchSearchTopStories(searchTerm, page = 0) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => this.setState({ error: e }));
    }

    onClickMe() {
        console.log(this)
        return () => {
            console.log(this);
        }
    }
    onSearchChange(e) {
        console.log('onSearchChange==>', e.target.value)
        this.setState({
            searchTerm: e.target.value
        })
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm });
        console.log('componentDidMount==>')
        this.fetchSearchTopStories(searchTerm);
    }

    render() {
        console.log('appRender==>')
        const {
            searchTerm,
            results,
            searchKey,
            error
        } = this.state;
        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0;
        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];
        return (
            // <div className="App">
            //     <button onClick={this.onClickMe()} type="button">Click Me</button>
            //     {
            //         this.state.list.map(item => {
            //             return (
            //                     <div onClick={() => this.onDismiss(item)}>{item.title}</div>
            //             )
            //         })
            //     }
            //     <header className="App-header">
            //         <img src={logo} className="App-logo" alt="logo" />
            //         <p>
            //             E1dit <code>src/App.js</code> and save to reload.
            //         </p>
            //         <a className="App-link" target="_blank" rel="noopener noreferrer">Learn React</a>
            //     </header>
                <div className="page">
                    <div className="interactions">
                        <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
                            <div>gaolinxiong</div>
                        </Search>
                    </div>
                    {error
                        ? <div className="interactions">
                            <p>Something went wrong.</p>
                        </div> :
                        list && <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss}/>
                    }
                    <div className="interactions">
                        <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
                            More
                        </Button>
                    </div>

                </div>
        )
    }

    onDismiss(objectID) {
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];
        const isNotId = item => item.objectID !== objectID;
        const updatedHits = hits.filter(isNotId);
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        })
    }
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
