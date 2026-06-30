import{i as e}from"./preload-helper-DID7B_--.js";import{bt as t}from"./iframe-C47sd5GD.js";import{n,t as r}from"./button-CuJSqrUQ.js";import{r as i,t as a}from"./useToast-OUoBmcVg.js";import{n as o,t as s}from"./Toaster-D7fNV9eK.js";var c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N;e((()=>{c=t(),o(),a(),n(),l={title:`Atoms/Toast/Toast`,component:s,parameters:{layout:`centered`},tags:[`autodocs`],decorators:[e=>(0,c.jsx)(`div`,{className:`w-[600px] min-h-[400px]`,children:(0,c.jsx)(e,{})})]},u=({title:e,description:t,variant:n,action:a})=>{let{toast:o}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{onClick:()=>{o({title:e,description:t,variant:n,action:a})},children:`Show Toast`}),(0,c.jsx)(s,{})]})},d={render:()=>(0,c.jsx)(u,{title:`Information`,description:`This is an informational message.`,variant:`info`})},f={render:()=>(0,c.jsx)(u,{title:`Success!`,description:`Your changes have been saved successfully.`,variant:`success`})},p={render:()=>(0,c.jsx)(u,{title:`Warning`,description:`This action may have unintended consequences.`,variant:`warning`})},m={render:()=>(0,c.jsx)(u,{title:`Error`,description:`Something went wrong. Please try again.`,variant:`error`})},h={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`space-y-4`,children:[(0,c.jsxs)(`div`,{className:`grid grid-cols-2 gap-4`,children:[(0,c.jsx)(r,{onClick:()=>{e({title:`Information`,description:`This is an informational message.`,variant:`info`})},children:`Info Toast`}),(0,c.jsx)(r,{variant:`success`,onClick:()=>{e({title:`Success!`,description:`Your changes have been saved.`,variant:`success`})},children:`Success Toast`}),(0,c.jsx)(r,{onClick:()=>{e({title:`Warning`,description:`Please proceed with caution.`,variant:`warning`})},children:`Warning Toast`}),(0,c.jsx)(r,{variant:`error`,onClick:()=>{e({title:`Error`,description:`Something went wrong.`,variant:`error`})},children:`Error Toast`})]}),(0,c.jsx)(s,{})]})}},g={render:()=>(0,c.jsx)(u,{title:`Quick notification`,variant:`info`})},_={render:()=>(0,c.jsx)(u,{title:`Saved!`,variant:`success`})},v={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{onClick:()=>{e({title:`File deleted`,description:`Your file has been moved to trash.`,variant:`warning`,action:(0,c.jsx)(r,{size:`sm`,variant:`neutral`,onClick:()=>{console.log(`Undo clicked`)},children:`Undo`})})},children:`Delete File`}),(0,c.jsx)(s,{})]})}},y={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{variant:`success`,onClick:()=>{e({title:`Profile updated`,description:`Your profile changes have been saved.`,variant:`success`,action:(0,c.jsx)(r,{size:`sm`,variant:`neutral`,onClick:()=>console.log(`View profile`),children:`View`})})},children:`Update Profile`}),(0,c.jsx)(s,{})]})}},b={render:()=>(0,c.jsx)(u,{title:`Operation completed successfully`,description:`Your data has been processed and synchronized across all devices. This may take a few moments to appear in your account.`,variant:`success`})},x={render:()=>(0,c.jsx)(u,{title:`An unexpected error occurred while processing your request`,description:`Please try again later or contact support if the problem persists.`,variant:`error`})},S={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{variant:`success`,onClick:()=>{e({title:`Changes saved`,description:`Your document has been saved successfully.`,variant:`success`})},children:`Save Document`}),(0,c.jsx)(s,{})]})}},C={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{variant:`error`,onClick:()=>{e({title:`Item deleted`,description:`The item has been permanently deleted.`,variant:`error`,action:(0,c.jsx)(r,{size:`sm`,variant:`neutral`,onClick:()=>console.log(`Undo delete`),children:`Undo`})})},children:`Delete Item`}),(0,c.jsx)(s,{})]})}},w={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{onClick:()=>{e({title:`Validation error`,description:`Please fill in all required fields.`,variant:`error`})},children:`Submit Form`}),(0,c.jsx)(s,{})]})}},T={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{variant:`error`,onClick:()=>{e({title:`Connection lost`,description:`Unable to connect to the server. Please check your internet connection.`,variant:`error`,action:(0,c.jsx)(r,{size:`sm`,variant:`neutral`,onClick:()=>console.log(`Retry`),children:`Retry`})})},children:`Simulate Network Error`}),(0,c.jsx)(s,{})]})}},E={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{variant:`success`,onClick:()=>{e({title:`Upload complete`,description:`Your file has been uploaded successfully.`,variant:`success`,action:(0,c.jsx)(r,{size:`sm`,variant:`neutral`,onClick:()=>console.log(`View file`),children:`View`})})},children:`Upload File`}),(0,c.jsx)(s,{})]})}},D={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{variant:`error`,onClick:()=>{e({title:`Access denied`,description:`You do not have permission to perform this action.`,variant:`error`})},children:`Access Resource`}),(0,c.jsx)(s,{})]})}},O={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(r,{onClick:()=>{e({title:`First notification`,description:`This is the first toast.`,variant:`info`}),setTimeout(()=>{e({title:`Second notification`,description:`This is the second toast.`,variant:`success`})},500),setTimeout(()=>{e({title:`Third notification`,description:`This is the third toast.`,variant:`warning`})},1e3)},children:`Show Multiple Toasts`}),(0,c.jsx)(s,{})]})}},k={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(`div`,{className:`text-center space-y-2 mb-4`,children:(0,c.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`This toast will auto-dismiss after 3 seconds`})}),(0,c.jsx)(r,{onClick:()=>{e({title:`Auto-dismissing notification`,description:`This will disappear automatically.`,variant:`info`})},children:`Show Auto-Dismiss Toast`}),(0,c.jsx)(s,{})]})}},A={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`dark p-8 rounded-lg bg-neutral-900`,children:[(0,c.jsxs)(`div`,{className:`grid grid-cols-2 gap-4`,children:[(0,c.jsx)(r,{onClick:()=>{e({title:`Information`,description:`This is an informational message.`,variant:`info`})},children:`Info`}),(0,c.jsx)(r,{variant:`success`,onClick:()=>{e({title:`Success`,description:`Operation completed successfully.`,variant:`success`})},children:`Success`}),(0,c.jsx)(r,{onClick:()=>{e({title:`Warning`,description:`Please proceed with caution.`,variant:`warning`})},children:`Warning`}),(0,c.jsx)(r,{variant:`error`,onClick:()=>{e({title:`Error`,description:`Something went wrong.`,variant:`error`})},children:`Error`})]}),(0,c.jsx)(s,{})]})},globals:{backgrounds:{value:`dark`}}},j={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`space-y-6`,children:[(0,c.jsxs)(`div`,{className:`space-y-4`,children:[(0,c.jsx)(`h3`,{className:`text-lg font-medium`,children:`Try different toast combinations`}),(0,c.jsxs)(`div`,{className:`grid grid-cols-2 gap-2`,children:[(0,c.jsx)(r,{size:`sm`,onClick:()=>{e({title:`Info`,variant:`info`})},children:`Info (no description)`}),(0,c.jsx)(r,{size:`sm`,onClick:()=>{e({title:`Info`,description:`With description`,variant:`info`})},children:`Info (with description)`}),(0,c.jsx)(r,{size:`sm`,variant:`success`,onClick:()=>{e({title:`Success`,variant:`success`})},children:`Success (no description)`}),(0,c.jsx)(r,{size:`sm`,variant:`success`,onClick:()=>{e({title:`Success`,description:`With description`,variant:`success`})},children:`Success (with description)`}),(0,c.jsx)(r,{size:`sm`,onClick:()=>{e({title:`Success with action`,description:`Click the action button`,variant:`success`,action:(0,c.jsx)(r,{size:`sm`,variant:`neutral`,onClick:()=>alert(`Action clicked!`),children:`Action`})})},children:`Success with action`}),(0,c.jsx)(r,{size:`sm`,variant:`error`,onClick:()=>{e({title:`Error with undo`,description:`You can undo this action`,variant:`error`,action:(0,c.jsx)(r,{size:`sm`,variant:`neutral`,onClick:()=>alert(`Undone!`),children:`Undo`})})},children:`Error with undo`})]})]}),(0,c.jsx)(s,{})]})}},M={render:()=>{let{toast:e}=i();return(0,c.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-4`,children:[(0,c.jsx)(`div`,{className:`text-center space-y-2 mb-4`,children:(0,c.jsx)(`p`,{className:`text-sm text-neutral-600 dark:text-neutral-400`,children:`Click to add a toast to the stack`})}),(0,c.jsxs)(`div`,{className:`grid grid-cols-2 gap-2`,children:[(0,c.jsx)(r,{size:`sm`,onClick:()=>{e({title:`New info message`,description:`Message #${Math.floor(Math.random()*100)}`,variant:`info`})},children:`Add Info`}),(0,c.jsx)(r,{size:`sm`,variant:`success`,onClick:()=>{e({title:`Success message`,description:`Operation #${Math.floor(Math.random()*100)} completed`,variant:`success`})},children:`Add Success`}),(0,c.jsx)(r,{size:`sm`,onClick:()=>{e({title:`Warning message`,description:`Warning #${Math.floor(Math.random()*100)}`,variant:`warning`})},children:`Add Warning`}),(0,c.jsx)(r,{size:`sm`,variant:`error`,onClick:()=>{e({title:`Error message`,description:`Error #${Math.floor(Math.random()*100)}`,variant:`error`})},children:`Add Error`})]}),(0,c.jsx)(s,{})]})}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Information" description="This is an informational message." variant="info" />
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Success!" description="Your changes have been saved successfully." variant="success" />
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Warning" description="This action may have unintended consequences." variant="warning" />
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Error" description="Something went wrong. Please try again." variant="error" />
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => {
          toast({
            title: 'Information',
            description: 'This is an informational message.',
            variant: 'info'
          });
        }}>
                        Info Toast
                    </Button>
                    <Button variant="success" onClick={() => {
          toast({
            title: 'Success!',
            description: 'Your changes have been saved.',
            variant: 'success'
          });
        }}>
                        Success Toast
                    </Button>
                    <Button onClick={() => {
          toast({
            title: 'Warning',
            description: 'Please proceed with caution.',
            variant: 'warning'
          });
        }}>
                        Warning Toast
                    </Button>
                    <Button variant="error" onClick={() => {
          toast({
            title: 'Error',
            description: 'Something went wrong.',
            variant: 'error'
          });
        }}>
                        Error Toast
                    </Button>
                </div>
                <Toaster />
            </div>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Quick notification" variant="info" />
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Saved!" variant="success" />
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button onClick={() => {
        toast({
          title: 'File deleted',
          description: 'Your file has been moved to trash.',
          variant: 'warning',
          action: <Button size="sm" variant="neutral" onClick={() => {
            console.log('Undo clicked');
          }}>
                                    Undo
                                </Button>
        });
      }}>
                    Delete File
                </Button>
                <Toaster />
            </div>;
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button variant="success" onClick={() => {
        toast({
          title: 'Profile updated',
          description: 'Your profile changes have been saved.',
          variant: 'success',
          action: <Button size="sm" variant="neutral" onClick={() => console.log('View profile')}>
                                    View
                                </Button>
        });
      }}>
                    Update Profile
                </Button>
                <Toaster />
            </div>;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Operation completed successfully" description="Your data has been processed and synchronized across all devices. This may take a few moments to appear in your account." variant="success" />
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="An unexpected error occurred while processing your request" description="Please try again later or contact support if the problem persists." variant="error" />
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button variant="success" onClick={() => {
        toast({
          title: 'Changes saved',
          description: 'Your document has been saved successfully.',
          variant: 'success'
        });
      }}>
                    Save Document
                </Button>
                <Toaster />
            </div>;
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button variant="error" onClick={() => {
        toast({
          title: 'Item deleted',
          description: 'The item has been permanently deleted.',
          variant: 'error',
          action: <Button size="sm" variant="neutral" onClick={() => console.log('Undo delete')}>
                                    Undo
                                </Button>
        });
      }}>
                    Delete Item
                </Button>
                <Toaster />
            </div>;
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button onClick={() => {
        toast({
          title: 'Validation error',
          description: 'Please fill in all required fields.',
          variant: 'error'
        });
      }}>
                    Submit Form
                </Button>
                <Toaster />
            </div>;
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button variant="error" onClick={() => {
        toast({
          title: 'Connection lost',
          description: 'Unable to connect to the server. Please check your internet connection.',
          variant: 'error',
          action: <Button size="sm" variant="neutral" onClick={() => console.log('Retry')}>
                                    Retry
                                </Button>
        });
      }}>
                    Simulate Network Error
                </Button>
                <Toaster />
            </div>;
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button variant="success" onClick={() => {
        toast({
          title: 'Upload complete',
          description: 'Your file has been uploaded successfully.',
          variant: 'success',
          action: <Button size="sm" variant="neutral" onClick={() => console.log('View file')}>
                                    View
                                </Button>
        });
      }}>
                    Upload File
                </Button>
                <Toaster />
            </div>;
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button variant="error" onClick={() => {
        toast({
          title: 'Access denied',
          description: 'You do not have permission to perform this action.',
          variant: 'error'
        });
      }}>
                    Access Resource
                </Button>
                <Toaster />
            </div>;
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <Button onClick={() => {
        toast({
          title: 'First notification',
          description: 'This is the first toast.',
          variant: 'info'
        });
        setTimeout(() => {
          toast({
            title: 'Second notification',
            description: 'This is the second toast.',
            variant: 'success'
          });
        }, 500);
        setTimeout(() => {
          toast({
            title: 'Third notification',
            description: 'This is the third toast.',
            variant: 'warning'
          });
        }, 1000);
      }}>
                    Show Multiple Toasts
                </Button>
                <Toaster />
            </div>;
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center space-y-2 mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">This toast will auto-dismiss after 3 seconds</p>
                </div>
                <Button onClick={() => {
        toast({
          title: 'Auto-dismissing notification',
          description: 'This will disappear automatically.',
          variant: 'info'
        });
      }}>
                    Show Auto-Dismiss Toast
                </Button>
                <Toaster />
            </div>;
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="dark p-8 rounded-lg bg-neutral-900">
                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={() => {
          toast({
            title: 'Information',
            description: 'This is an informational message.',
            variant: 'info'
          });
        }}>
                        Info
                    </Button>
                    <Button variant="success" onClick={() => {
          toast({
            title: 'Success',
            description: 'Operation completed successfully.',
            variant: 'success'
          });
        }}>
                        Success
                    </Button>
                    <Button onClick={() => {
          toast({
            title: 'Warning',
            description: 'Please proceed with caution.',
            variant: 'warning'
          });
        }}>
                        Warning
                    </Button>
                    <Button variant="error" onClick={() => {
          toast({
            title: 'Error',
            description: 'Something went wrong.',
            variant: 'error'
          });
        }}>
                        Error
                    </Button>
                </div>
                <Toaster />
            </div>;
  },
  globals: {
    backgrounds: {
      value: "dark"
    }
  }
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Try different toast combinations</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" onClick={() => {
            toast({
              title: 'Info',
              variant: 'info'
            });
          }}>
                            Info (no description)
                        </Button>
                        <Button size="sm" onClick={() => {
            toast({
              title: 'Info',
              description: 'With description',
              variant: 'info'
            });
          }}>
                            Info (with description)
                        </Button>
                        <Button size="sm" variant="success" onClick={() => {
            toast({
              title: 'Success',
              variant: 'success'
            });
          }}>
                            Success (no description)
                        </Button>
                        <Button size="sm" variant="success" onClick={() => {
            toast({
              title: 'Success',
              description: 'With description',
              variant: 'success'
            });
          }}>
                            Success (with description)
                        </Button>
                        <Button size="sm" onClick={() => {
            toast({
              title: 'Success with action',
              description: 'Click the action button',
              variant: 'success',
              action: <Button size="sm" variant="neutral" onClick={() => alert('Action clicked!')}>
                                            Action
                                        </Button>
            });
          }}>
                            Success with action
                        </Button>
                        <Button size="sm" variant="error" onClick={() => {
            toast({
              title: 'Error with undo',
              description: 'You can undo this action',
              variant: 'error',
              action: <Button size="sm" variant="neutral" onClick={() => alert('Undone!')}>
                                            Undo
                                        </Button>
            });
          }}>
                            Error with undo
                        </Button>
                    </div>
                </div>
                <Toaster />
            </div>;
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => {
    const {
      toast
    } = useToast();
    return <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-center space-y-2 mb-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Click to add a toast to the stack</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={() => {
          toast({
            title: 'New info message',
            description: \`Message #\${Math.floor(Math.random() * 100)}\`,
            variant: 'info'
          });
        }}>
                        Add Info
                    </Button>
                    <Button size="sm" variant="success" onClick={() => {
          toast({
            title: 'Success message',
            description: \`Operation #\${Math.floor(Math.random() * 100)} completed\`,
            variant: 'success'
          });
        }}>
                        Add Success
                    </Button>
                    <Button size="sm" onClick={() => {
          toast({
            title: 'Warning message',
            description: \`Warning #\${Math.floor(Math.random() * 100)}\`,
            variant: 'warning'
          });
        }}>
                        Add Warning
                    </Button>
                    <Button size="sm" variant="error" onClick={() => {
          toast({
            title: 'Error message',
            description: \`Error #\${Math.floor(Math.random() * 100)}\`,
            variant: 'error'
          });
        }}>
                        Add Error
                    </Button>
                </div>
                <Toaster />
            </div>;
  }
}`,...M.parameters?.docs?.source}}},N=[`Info`,`Success`,`Warning`,`Error`,`AllVariants`,`TitleOnly`,`SuccessNoDescription`,`WithAction`,`SuccessWithAction`,`LongContent`,`LongTitle`,`SaveSuccess`,`DeleteConfirmation`,`FormValidation`,`NetworkError`,`UploadSuccess`,`PermissionDenied`,`MultipleToasts`,`AutoDismiss`,`DarkMode`,`Interactive`,`ToastStack`]}))();export{h as AllVariants,k as AutoDismiss,A as DarkMode,C as DeleteConfirmation,m as Error,w as FormValidation,d as Info,j as Interactive,b as LongContent,x as LongTitle,O as MultipleToasts,T as NetworkError,D as PermissionDenied,S as SaveSuccess,f as Success,_ as SuccessNoDescription,y as SuccessWithAction,g as TitleOnly,M as ToastStack,E as UploadSuccess,p as Warning,v as WithAction,N as __namedExportsOrder,l as default};