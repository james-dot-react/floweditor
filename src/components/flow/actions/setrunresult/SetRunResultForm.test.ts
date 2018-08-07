import SetRunResultForm from '~/components/flow/actions/setrunresult/SetRunResultForm';
import { ActionFormProps } from '~/components/flow/props';
import { composeComponentTestUtils, mock } from '~/testUtils';
import { createSetRunResultAction, getActionFormProps } from '~/testUtils/assetCreators';
import * as utils from '~/utils';

const { setup } = composeComponentTestUtils<ActionFormProps>(
    SetRunResultForm,
    getActionFormProps(createSetRunResultAction())
);

mock(utils, 'createUUID', utils.seededUUIDs());

describe(SetRunResultForm.name, () => {
    describe('render', () => {
        it('should render', () => {
            const { wrapper } = setup(true);
            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('updates', () => {
        it('should save changes', () => {
            const { instance, props } = setup(true);

            instance.handleNameUpdate('Result Name');
            instance.handleValueUpdate('Result Value');
            instance.handleCategoryUpdate('Result Category');

            expect(instance.state).toMatchSnapshot();

            instance.handleSave();
            expect(props.updateAction).toHaveBeenCalled();
            expect((props.updateAction as any).mock.calls[0]).toMatchSnapshot();
        });

        it('should allow switching from router', () => {
            const { instance, props } = setup(true, {
                $merge: { updateAction: jest.fn() },
                nodeSettings: { $merge: { originalAction: null } }
            });

            instance.handleNameUpdate('Result Name');
            instance.handleValueUpdate('Result Value');
            instance.handleCategoryUpdate('Result Category');
            instance.handleSave();

            expect((props.updateAction as any).mock.calls[0]).toMatchSnapshot();
        });
    });

    describe('cancel', () => {
        it('should cancel without changes', () => {
            const { instance, props } = setup(true, {
                $merge: { onClose: jest.fn(), updateAction: jest.fn() }
            });

            instance.handleNameUpdate("Don't Save Me");
            instance.getButtons().secondary.onClick();
            expect(props.onClose).toHaveBeenCalled();
            expect(props.updateAction).not.toHaveBeenCalled();
        });
    });
});