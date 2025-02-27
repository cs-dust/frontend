import { shallow } from 'enzyme';
import { Chapter, Variant } from 'js-slang/dist/types';
import { Provider } from 'react-redux';
import { mockInitialStore } from 'src/commons/mocks/StoreMocks';

import { mockRouterProps } from '../../../commons/mocks/ComponentMocks';
import { assertType } from '../../../commons/utils/TypeHelper';
import Playground, { handleHash, PlaygroundProps } from '../Playground';

const baseProps = assertType<PlaygroundProps>()({
  execTime: 1000,
  stepLimit: 1000,
  isRunning: false,
  isDebugging: false,
  enableDebugging: true,
  activeEditorTabIndex: 0,
  editorTabs: [{ value: '', highlightedLines: [], breakpoints: [] }],
  programPrependValue: '',
  programPostpendValue: '',
  editorSessionId: '',
  isEditorAutorun: false,
  sideContentHeight: 40,
  playgroundSourceChapter: Chapter.SOURCE_2,
  playgroundSourceVariant: Variant.DEFAULT,
  output: [],
  replValue: '',
  sharedbConnected: false,
  usingSubst: false,
  persistenceUser: undefined,
  persistenceFile: undefined,
  githubOctokitObject: { octokit: undefined },
  githubSaveInfo: { repoName: '', filePath: '' },
  handleChangeExecTime: (execTime: number) => {},
  handleChapterSelect: (chapter: Chapter) => {},
  handleEditorValueChange: () => {},
  handleEditorUpdateBreakpoints: (breakpoints: string[]) => {},
  handleReplEval: () => {},
  handleReplOutputClear: () => {},
  handleUsingSubst: (usingSubst: boolean) => {}
});

const testValueProps: PlaygroundProps = {
  ...baseProps,
  ...mockRouterProps('/academy', {}),
  editorTabs: [{ ...baseProps.editorTabs[0], value: 'Test value' }]
};

const playgroundLinkProps: PlaygroundProps = {
  ...baseProps,
  ...mockRouterProps('/playground#lib=2&prgrm=CYSwzgDgNghgngCgOQAsCmUoHsCESCUA3EA', {}),
  editorTabs: [{ ...baseProps.editorTabs[0], value: 'This should not show up' }]
};

const mockStore = mockInitialStore();

test('Playground renders correctly', () => {
  const app = (
    <Provider store={mockStore}>
      <Playground {...testValueProps} />
    </Provider>
  );
  const tree = shallow(app);
  expect(tree.debug()).toMatchSnapshot();
});

test('Playground with link renders correctly', () => {
  const app = (
    <Provider store={mockStore}>
      <Playground {...playgroundLinkProps} />
    </Provider>
  );
  const tree = shallow(app);
  expect(tree.debug()).toMatchSnapshot();
});

describe('handleHash', () => {
  test('disables loading hash with fullJS chapter in URL params', () => {
    const testHash = '#chap=-1&prgrm=CYSwzgDgNghgngCgOQAsCmUoHsCESCUA3EA';

    const mockHandleEditorValueChanged = jest.fn();
    const mockHandleChapterSelect = jest.fn();
    const mockHandleChangeExecTime = jest.fn();

    handleHash(testHash, {
      ...playgroundLinkProps, // dummy props (will not be used)
      handleEditorValueChange: mockHandleEditorValueChanged,
      handleChapterSelect: mockHandleChapterSelect,
      handleChangeExecTime: mockHandleChangeExecTime
    });

    expect(mockHandleEditorValueChanged).not.toHaveBeenCalled();
    expect(mockHandleChapterSelect).not.toHaveBeenCalled();
    expect(mockHandleChangeExecTime).not.toHaveBeenCalled();
  });
});
