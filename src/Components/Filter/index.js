import React, {Component} from 'react';

import './styles.css';

export default class Filter extends Component{
    render() {
        return (
            <div id='mainFilter'>
                <p id='descriptionFilter'>
                    Ordenar por: 
                </p>

                <button id='buttonFilterName' onClick={this.props.toOrderByName}>
                    Nome
                </button>

                <button id='buttonFilterValidade' onClick={this.props.toOrderByDate}>
                    Validade
                </button>
            </div>
        );
    }
}