import React, {Component} from 'react';

import Filter from '../../Components/Filter';

import './styles.css';

import api from '../../Services/api';

export default class Main extends Component {

    state = {
        cnhs: [],
        uniqueCnhs: [],
    };

    componentDidMount(){
        this.loadCNHs();
    }

    loadCNHs = async () => {
        //CARREGANDO OS DADOS DA API
        const response = await api.get('desafio');

        //PEGANDO OS DADOS DO CAMPO "data" DA API
        const initialCnhs = response.data.data;

        //ARRAY QUE GUARDARA OS DADOS DO CAMPO "data" SEM REPETIR (VERIFICADOS POR RG)
        var cnhsUniq = [];

        /*
        PASSANDO POR CADA ELEMENTO DOS DADOS DO CAMPOR "data" PARA PEGAR, APENAS, OS
        ELEMENTOS DIFERENTES(RG/documento)
        */
        initialCnhs.forEach((value) => {
            var cont = 0;
            for(var i = 0; i < cnhsUniq.length; i++){
                if(Object.is(value.documento, cnhsUniq[i].documento)){
                    cont += 1;
                }
            } 
            if(cont === 0){
                cnhsUniq.push(value);
            }  
        });

        //SETTANDO NO ESTADO O ARRAY COM TODOS OS ELEMENTOS E O SEM ELEMENTOS REPETIDOS
        this.setState({ cnhs: initialCnhs, uniqueCnhs: cnhsUniq });
    };

    //ORDENA O ARRAY DE CNHs PELA INICIAL DO NOME
    orderByName = () => {
        const cnhs = this.state.uniqueCnhs;

        cnhs.sort((a, b) => {
            if(a.nome > b.nome) return 1;
            if(a.nome < b.nome) return -1;
            return 0;
        });

        this.setState({uniqueCnhs: cnhs});
    };

    //ORDENA O ARRAY DE CNHs PELA DATA DE VALIDADE
    orderByDate = () => {
        const cnhs = this.state.uniqueCnhs;

        var cnhsUniq = [];

        //ORDENO POR ANO
        cnhs.sort((a, b) => {
            if(a.validade.year > b.validade.year) return 1;
            if(a.validade.year < b.validade.year) return -1;
            return 0;
        });

        //SE HOUVER ANOS IGUAIS, ORDENO POR MES
        var equalsYear = false;
        cnhs.forEach((value) => {
            var cont = 0;
            for(var i = 0; i < cnhsUniq.length; i++){
                if(Object.is(value.validade.year, cnhsUniq[i].validade.year)){
                    cont += 1;
                }
            } 
            if(cont === 0){
                cnhsUniq.push(value);
            }else{
                equalsYear = true;
            }  
        });

        if(equalsYear){
            cnhsUniq = [];

            //ORDENO POR MES
            cnhs.sort((a, b) => {
                if(a.validade.month > b.validade.month) return 1;
                if(a.validade.month < b.validade.month) return -1;
                return 0;
            });

            //SE HOUVER MESES IGUAIS, ORDENO POR DIAS
            var equalsYear = false;
            cnhs.forEach((value) => {
                var cont = 0;
                for(var i = 0; i < cnhsUniq.length; i++){
                    if(Object.is(value.validade.month, cnhsUniq[i].validade.month)){
                        cont += 1;
                    }
                } 
                if(cont === 0){
                    cnhsUniq.push(value);
                }else{
                    equalsYear = true;
                }  
            });

            if(equalsYear){
                cnhsUniq = [];

                //ORDENO POR DIA
                cnhs.sort((a, b) => {
                    if(a.validade.day > b.validade.day) return 1;
                    if(a.validade.day < b.validade.day) return -1;
                    return 0;
                });
            }
        }

        this.setState({uniqueCnhs: cnhs});
    };

    render() {

        //DESESTRUTURANDO ESTE ELEMENTO PARA TRABALHAR COM ELE DE FORMA MAIS SIMPLES
        const {uniqueCnhs} = this.state;
        
        return(
            <div id='containerMain'>
                <Filter toOrderByName={this.orderByName.bind(this)}
                        toOrderByDate={this.orderByDate.bind(this)}
                />

                <div className='cnhsList'>
                    {uniqueCnhs.map(cnh => (
                        <article>

                            <p className='nome'>
                                <strong>Nome:</strong><br/>
                                {cnh.nome}
                            </p>
                            <div className = 'paraleloCentral'>
                            <img className='foto' src={cnh.imageUrl} style={{width:200, height:200}}/>
                                <div className='informacoes'>
                                    <p className='rg'>
                                        <strong>RG:</strong><br/>
                                        {cnh.documento}
                                    </p>
                                    <div className = 'paraleloUnitario1'>
                                        <p className='cpf'>
                                            <strong>CPF:</strong><br/>
                                            {cnh.cpf.numero}
                                        </p>
                                        <p className='dataNascimento'>
                                            <strong>Data de Nascimento:</strong><br/>
                                            ../../..
                                        </p>
                                    </div>
                                    <p className = 'filiacaoPai'>
                                        <strong>Pai:</strong><br/>
                                        {cnh.filiacao.pai}
                                    </p>
                                    <p className = 'filiacaoMae'>
                                        <strong>Mãe:</strong><br/>
                                        {cnh.filiacao.mae}
                                    </p>
                                    <div className = 'paraleloUnitario2'>
                                        <p className='permissao'>
                                            <strong>Permissão:</strong><br/>
                                            ...
                                        </p>
                                        <p className='acc'>
                                            <strong>ACC:</strong><br/>
                                            ...
                                        </p>
                                        <p className='catHab'>
                                            <strong>Cat. Hab.</strong><br/>
                                            {cnh.categoria}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className = 'paraleloUnitario3'>
                                <p className='numeroRegistro'>
                                    <strong>Número de Registro:</strong><br/>
                                    {cnh.registro}
                                </p>
                                <p className='validade'>
                                    <strong>Validade:</strong><br/>
                                    {cnh.validade.day}/{cnh.validade.month}/{cnh.validade.year}
                                </p>
                                <p className='primeiraHabilitacao'>
                                    <strong>Primeira Habilitação:</strong><br/>
                                    {cnh.primeiraHabilitacao.day}/{cnh.primeiraHabilitacao.month}/{cnh.primeiraHabilitacao.year}
                                </p>
                            </div>
                                
                        </article>
                    ))
                    }
                </div>
            </div>
        );
    }
}