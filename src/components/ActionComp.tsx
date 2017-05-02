import * as React from "react";
import * as axios from "axios";
import * as Interfaces from '../interfaces'
import Plumber from '../services/Plumber';
import FlowStore from '../services/FlowStore';
import Config from '../services/Config';
import NodeModal from './NodeModal';
import TitleBar from './TitleBar';

let PropTypes = require("prop-types");
let UUID  = require("uuid");

/**
 * Base Action class for the rendered flow
 */
export class ActionComp<P extends Interfaces.ActionProps> extends React.Component<P, {}> {

    public form: HTMLFormElement;
    private modal: NodeModal;

    static contextTypes = {
        flow: PropTypes.object,
        node: PropTypes.object
    }
    
    context: Interfaces.FlowContext;
    
    constructor(props: P) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    setEditing(editing: boolean) {
        this.setState({editing: editing})
    }

    onClick (event: React.SyntheticEvent<MouseEvent>) {
        console.log('click', this.props.uuid);
        if (!this.context.node.state.dragging) {
            this.modal.open();
        }
    }

    getClassName() {
        return this.props.type.split('_').join('-');
    }

    private onConfirmRemoval(evt: React.SyntheticEvent<MouseEvent>) {
        evt.stopPropagation();
        this.setState({confirmRemoval: true})
    }

    private onRemoval(evt: React.SyntheticEvent<MouseEvent>) {
        evt.stopPropagation();
        if (!this.context.node.state.dragging) {
            this.context.flow.removeAction(this.props);
        }
    }

    render() {
        let config = Config.get().getTypeConfig(this.props.type);
        let renderer = new config.renderer(this.props, this.context);

        var events = {}
        if (!this.context.node.state.dragging) {
            events = {onMouseUp: this.onClick.bind(this)}
        }

        return(
            <div>
                <div className={'action ' + this.getClassName()} {...events}>
                    <TitleBar className="action-title" title={config.name} onRemoval={this.onRemoval.bind(this)}/>
                    <div className="action-content">
                        {renderer.renderNode()}
                    </div>
                </div>
                <NodeModal 
                    ref={(ele: any) => {this.modal = ele}} 
                    initial={this.props}
                    context={this.context}
                    renderer={renderer}
                    changeType={true}
                /> 
            </div>
        )
    }
    
    getType() {
        return this.props.type;
    }
}

export default ActionComp;