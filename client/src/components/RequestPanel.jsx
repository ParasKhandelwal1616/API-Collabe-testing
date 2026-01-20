import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateHeader, addHeader, removeHeader, setBodyContent, addQueryParam, updateQueryParam, removeQueryParam } from '../features/request/requestSlice';
import Editor from '@monaco-editor/react';
import KeyValueEditor from './KeyValueEditor';

export default function RequestPanel() {
  const dispatch = useDispatch();
  const { currentRequest } = useSelector((state) => state.request);
  const [activeTab, setActiveTab] = useState('params'); // params, headers, body

  // Tabs Styling Helper
  const tabClass = (name) => 
    `px-4 py-2 text-sm font-medium cursor-pointer border-b-2 ${
      activeTab === name 
        ? 'border-blue-500 text-blue-400' 
        : 'border-transparent text-gray-400 hover:text-white'
    }`;

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] border-r border-gray-700">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-700">
        <div onClick={() => setActiveTab('params')} className={tabClass('params')}>Params</div>
        <div onClick={() => setActiveTab('headers')} className={tabClass('headers')}>Headers</div>
        <div onClick={() => setActiveTab('body')} className={tabClass('body')}>Body</div>
      </div>

      {/* Tabs Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'params' && (
           <KeyValueEditor 
            pairs={currentRequest.queryParams || []}
            onAdd={() => dispatch(addQueryParam())}
            onRemove={(idx) => dispatch(removeQueryParam(idx))}
            onUpdate={(idx, field, value) => dispatch(updateQueryParam({ index: idx, field, value }))}
          />
        )}

        {activeTab === 'headers' && (
          <KeyValueEditor 
            pairs={currentRequest.headers}
            onAdd={() => dispatch(addHeader())}
            onRemove={(idx) => dispatch(removeHeader(idx))}
            onUpdate={(idx, field, value) => dispatch(updateHeader({ index: idx, field, value }))}
          />
        )}

        {activeTab === 'body' && (
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={currentRequest.bodyContent}
            onChange={(value) => dispatch(setBodyContent(value))}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false
            }}
          />
        )}
      </div>
    </div>
  );
}
