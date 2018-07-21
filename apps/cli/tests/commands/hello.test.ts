import { handler as hello } from '../../src/commands/hello';
import { runWithAnswers, ENTER } from '../utils';
import * as utils from '../../src/utils';

// silence outputs
jest.mock('inquirer/lib/utils/screen-manager');
jest.mock('../../src/utils');

const logInfo = jest.spyOn(utils, 'logInfo');
const renderQuestion = jest.spyOn(
  require('inquirer/lib/utils/screen-manager').prototype,
  'render'
);

afterEach(() => {
  logInfo.mockReset();
  renderQuestion.mockReset();
});

describe('hello', () => {
  it('says hello with the right name, after asking it if not provided', async () => {
    await runWithAnswers(() => hello({}), ['gabro', ENTER]);
    expect(renderQuestion.mock.calls[0][0]).toMatchSnapshot();
    expect(logInfo).toHaveBeenCalledTimes(2);
    expect(logInfo.mock.calls[0][0]).toMatchSnapshot();
    expect(logInfo.mock.calls[1][0]).toMatchSnapshot();
  });

  it('says hello with the right name, without asking it if provided', async () => {
    await runWithAnswers(() => hello({ name: 'gabro' }));
    expect(renderQuestion).not.toHaveBeenCalled();
    expect(logInfo).toHaveBeenCalledTimes(1);
    expect(logInfo.mock.calls[0][0]).toMatchSnapshot();
  });
});
