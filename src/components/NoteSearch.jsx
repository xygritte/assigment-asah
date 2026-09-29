import React from "react";

class NoteSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchKeyword: '',
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onChangeHandler(event) {
        const searchKeyword = event.target.value;

        this.setState({
            searchKeyword,
        });
        this.props.onSearch(searchKeyword);
    }
    render() {
        return (
            <div className="note-search" data-testid="note-search">
                <input 
                type="text"
                placeholder="cari berdasarkan judul.."
                value={this.state.searchKeyword}
                onChange={this.onChangeHandler}
                data-testid="note-search-input"
                />
            </div>
        );
    }
}

export default NoteSearch;