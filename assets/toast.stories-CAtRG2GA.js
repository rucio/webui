import{j as e}from"./iframe-CbZ9RuD1.js";import{T as r}from"./Toaster-CU-bfwMZ.js";import{u as i}from"./useToast-YXabfrDf.js";import{B as s}from"./button-CTUPBRYB.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BVAf5DAB.js";import"./index-YEY9OEgd.js";import"./index-B5AF9blO.js";import"./index-Dwd-kS-d.js";import"./index-CI9TgWTM.js";import"./index-DSpI4bVK.js";import"./utils-DsKtx5Xo.js";import"./tw-merge-Ds6tgvmq.js";import"./index.esm-Bh9o6rCW.js";import"./iconBase-BDSQWw1B.js";const ot={title:"Atoms/Toast/Toast",component:r,parameters:{layout:"centered"},tags:["autodocs"],decorators:[t=>e.jsx("div",{className:"w-[600px] min-h-[400px]",children:e.jsx(t,{})})]},o=({title:t,description:Fe,variant:Oe,action:$e})=>{const{toast:Re}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{onClick:()=>{Re({title:t,description:Fe,variant:Oe,action:$e})},children:"Show Toast"}),e.jsx(r,{})]})},a={render:()=>e.jsx(o,{title:"Information",description:"This is an informational message.",variant:"info"})},n={render:()=>e.jsx(o,{title:"Success!",description:"Your changes have been saved successfully.",variant:"success"})},c={render:()=>e.jsx(o,{title:"Warning",description:"This action may have unintended consequences.",variant:"warning"})},l={render:()=>e.jsx(o,{title:"Error",description:"Something went wrong. Please try again.",variant:"error"})},d={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(s,{onClick:()=>{t({title:"Information",description:"This is an informational message.",variant:"info"})},children:"Info Toast"}),e.jsx(s,{variant:"success",onClick:()=>{t({title:"Success!",description:"Your changes have been saved.",variant:"success"})},children:"Success Toast"}),e.jsx(s,{onClick:()=>{t({title:"Warning",description:"Please proceed with caution.",variant:"warning"})},children:"Warning Toast"}),e.jsx(s,{variant:"error",onClick:()=>{t({title:"Error",description:"Something went wrong.",variant:"error"})},children:"Error Toast"})]}),e.jsx(r,{})]})}},u={render:()=>e.jsx(o,{title:"Quick notification",variant:"info"})},m={render:()=>e.jsx(o,{title:"Saved!",variant:"success"})},p={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{onClick:()=>{t({title:"File deleted",description:"Your file has been moved to trash.",variant:"warning",action:e.jsx(s,{size:"sm",variant:"neutral",onClick:()=>{console.log("Undo clicked")},children:"Undo"})})},children:"Delete File"}),e.jsx(r,{})]})}},v={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{variant:"success",onClick:()=>{t({title:"Profile updated",description:"Your profile changes have been saved.",variant:"success",action:e.jsx(s,{size:"sm",variant:"neutral",onClick:()=>console.log("View profile"),children:"View"})})},children:"Update Profile"}),e.jsx(r,{})]})}},h={render:()=>e.jsx(o,{title:"Operation completed successfully",description:"Your data has been processed and synchronized across all devices. This may take a few moments to appear in your account.",variant:"success"})},f={render:()=>e.jsx(o,{title:"An unexpected error occurred while processing your request",description:"Please try again later or contact support if the problem persists.",variant:"error"})},g={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{variant:"success",onClick:()=>{t({title:"Changes saved",description:"Your document has been saved successfully.",variant:"success"})},children:"Save Document"}),e.jsx(r,{})]})}},x={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{variant:"error",onClick:()=>{t({title:"Item deleted",description:"The item has been permanently deleted.",variant:"error",action:e.jsx(s,{size:"sm",variant:"neutral",onClick:()=>console.log("Undo delete"),children:"Undo"})})},children:"Delete Item"}),e.jsx(r,{})]})}},j={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{onClick:()=>{t({title:"Validation error",description:"Please fill in all required fields.",variant:"error"})},children:"Submit Form"}),e.jsx(r,{})]})}},k={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{variant:"error",onClick:()=>{t({title:"Connection lost",description:"Unable to connect to the server. Please check your internet connection.",variant:"error",action:e.jsx(s,{size:"sm",variant:"neutral",onClick:()=>console.log("Retry"),children:"Retry"})})},children:"Simulate Network Error"}),e.jsx(r,{})]})}},T={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{variant:"success",onClick:()=>{t({title:"Upload complete",description:"Your file has been uploaded successfully.",variant:"success",action:e.jsx(s,{size:"sm",variant:"neutral",onClick:()=>console.log("View file"),children:"View"})})},children:"Upload File"}),e.jsx(r,{})]})}},C={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{variant:"error",onClick:()=>{t({title:"Access denied",description:"You do not have permission to perform this action.",variant:"error"})},children:"Access Resource"}),e.jsx(r,{})]})}},S={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx(s,{onClick:()=>{t({title:"First notification",description:"This is the first toast.",variant:"info"}),setTimeout(()=>{t({title:"Second notification",description:"This is the second toast.",variant:"success"})},500),setTimeout(()=>{t({title:"Third notification",description:"This is the third toast.",variant:"warning"})},1e3)},children:"Show Multiple Toasts"}),e.jsx(r,{})]})}},y={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx("div",{className:"text-center space-y-2 mb-4",children:e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"This toast will auto-dismiss after 3 seconds"})}),e.jsx(s,{onClick:()=>{t({title:"Auto-dismissing notification",description:"This will disappear automatically.",variant:"info"})},children:"Show Auto-Dismiss Toast"}),e.jsx(r,{})]})}},B={parameters:{backgrounds:{default:"dark"}},render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"dark p-8 rounded-lg bg-neutral-900",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(s,{onClick:()=>{t({title:"Information",description:"This is an informational message.",variant:"info"})},children:"Info"}),e.jsx(s,{variant:"success",onClick:()=>{t({title:"Success",description:"Operation completed successfully.",variant:"success"})},children:"Success"}),e.jsx(s,{onClick:()=>{t({title:"Warning",description:"Please proceed with caution.",variant:"warning"})},children:"Warning"}),e.jsx(s,{variant:"error",onClick:()=>{t({title:"Error",description:"Something went wrong.",variant:"error"})},children:"Error"})]}),e.jsx(r,{})]})}},w={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-medium",children:"Try different toast combinations"}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(s,{size:"sm",onClick:()=>{t({title:"Info",variant:"info"})},children:"Info (no description)"}),e.jsx(s,{size:"sm",onClick:()=>{t({title:"Info",description:"With description",variant:"info"})},children:"Info (with description)"}),e.jsx(s,{size:"sm",variant:"success",onClick:()=>{t({title:"Success",variant:"success"})},children:"Success (no description)"}),e.jsx(s,{size:"sm",variant:"success",onClick:()=>{t({title:"Success",description:"With description",variant:"success"})},children:"Success (with description)"}),e.jsx(s,{size:"sm",onClick:()=>{t({title:"Success with action",description:"Click the action button",variant:"success",action:e.jsx(s,{size:"sm",variant:"neutral",onClick:()=>alert("Action clicked!"),children:"Action"})})},children:"Success with action"}),e.jsx(s,{size:"sm",variant:"error",onClick:()=>{t({title:"Error with undo",description:"You can undo this action",variant:"error",action:e.jsx(s,{size:"sm",variant:"neutral",onClick:()=>alert("Undone!"),children:"Undo"})})},children:"Error with undo"})]})]}),e.jsx(r,{})]})}},N={render:()=>{const{toast:t}=i();return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-4",children:[e.jsx("div",{className:"text-center space-y-2 mb-4",children:e.jsx("p",{className:"text-sm text-neutral-600 dark:text-neutral-400",children:"Click to add a toast to the stack"})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(s,{size:"sm",onClick:()=>{t({title:"New info message",description:`Message #${Math.floor(Math.random()*100)}`,variant:"info"})},children:"Add Info"}),e.jsx(s,{size:"sm",variant:"success",onClick:()=>{t({title:"Success message",description:`Operation #${Math.floor(Math.random()*100)} completed`,variant:"success"})},children:"Add Success"}),e.jsx(s,{size:"sm",onClick:()=>{t({title:"Warning message",description:`Warning #${Math.floor(Math.random()*100)}`,variant:"warning"})},children:"Add Warning"}),e.jsx(s,{size:"sm",variant:"error",onClick:()=>{t({title:"Error message",description:`Error #${Math.floor(Math.random()*100)}`,variant:"error"})},children:"Add Error"})]}),e.jsx(r,{})]})}};var z,b,A;a.parameters={...a.parameters,docs:{...(z=a.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Information" description="This is an informational message." variant="info" />
}`,...(A=(b=a.parameters)==null?void 0:b.docs)==null?void 0:A.source}}};var E,I,W;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Success!" description="Your changes have been saved successfully." variant="success" />
}`,...(W=(I=n.parameters)==null?void 0:I.docs)==null?void 0:W.source}}};var M,U,D;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Warning" description="This action may have unintended consequences." variant="warning" />
}`,...(D=(U=c.parameters)==null?void 0:U.docs)==null?void 0:D.source}}};var P,Y,V;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Error" description="Something went wrong. Please try again." variant="error" />
}`,...(V=(Y=l.parameters)==null?void 0:Y.docs)==null?void 0:V.source}}};var F,O,$;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...($=(O=d.parameters)==null?void 0:O.docs)==null?void 0:$.source}}};var R,q,L;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Quick notification" variant="info" />
}`,...(L=(q=u.parameters)==null?void 0:q.docs)==null?void 0:L.source}}};var Q,_,G;m.parameters={...m.parameters,docs:{...(Q=m.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Saved!" variant="success" />
}`,...(G=(_=m.parameters)==null?void 0:_.docs)==null?void 0:G.source}}};var H,J,K;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
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
}`,...(K=(J=p.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var X,Z,ee;v.parameters={...v.parameters,docs:{...(X=v.parameters)==null?void 0:X.docs,source:{originalSource:`{
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
}`,...(ee=(Z=v.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,se,re;h.parameters={...h.parameters,docs:{...(te=h.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="Operation completed successfully" description="Your data has been processed and synchronized across all devices. This may take a few moments to appear in your account." variant="success" />
}`,...(re=(se=h.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var ie,oe,ae;f.parameters={...f.parameters,docs:{...(ie=f.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <ToastTrigger title="An unexpected error occurred while processing your request" description="Please try again later or contact support if the problem persists." variant="error" />
}`,...(ae=(oe=f.parameters)==null?void 0:oe.docs)==null?void 0:ae.source}}};var ne,ce,le;g.parameters={...g.parameters,docs:{...(ne=g.parameters)==null?void 0:ne.docs,source:{originalSource:`{
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
}`,...(le=(ce=g.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var de,ue,me;x.parameters={...x.parameters,docs:{...(de=x.parameters)==null?void 0:de.docs,source:{originalSource:`{
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
}`,...(me=(ue=x.parameters)==null?void 0:ue.docs)==null?void 0:me.source}}};var pe,ve,he;j.parameters={...j.parameters,docs:{...(pe=j.parameters)==null?void 0:pe.docs,source:{originalSource:`{
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
}`,...(he=(ve=j.parameters)==null?void 0:ve.docs)==null?void 0:he.source}}};var fe,ge,xe;k.parameters={...k.parameters,docs:{...(fe=k.parameters)==null?void 0:fe.docs,source:{originalSource:`{
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
}`,...(xe=(ge=k.parameters)==null?void 0:ge.docs)==null?void 0:xe.source}}};var je,ke,Te;T.parameters={...T.parameters,docs:{...(je=T.parameters)==null?void 0:je.docs,source:{originalSource:`{
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
}`,...(Te=(ke=T.parameters)==null?void 0:ke.docs)==null?void 0:Te.source}}};var Ce,Se,ye;C.parameters={...C.parameters,docs:{...(Ce=C.parameters)==null?void 0:Ce.docs,source:{originalSource:`{
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
}`,...(ye=(Se=C.parameters)==null?void 0:Se.docs)==null?void 0:ye.source}}};var Be,we,Ne;S.parameters={...S.parameters,docs:{...(Be=S.parameters)==null?void 0:Be.docs,source:{originalSource:`{
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
}`,...(Ne=(we=S.parameters)==null?void 0:we.docs)==null?void 0:Ne.source}}};var ze,be,Ae;y.parameters={...y.parameters,docs:{...(ze=y.parameters)==null?void 0:ze.docs,source:{originalSource:`{
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
}`,...(Ae=(be=y.parameters)==null?void 0:be.docs)==null?void 0:Ae.source}}};var Ee,Ie,We;B.parameters={...B.parameters,docs:{...(Ee=B.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
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
  }
}`,...(We=(Ie=B.parameters)==null?void 0:Ie.docs)==null?void 0:We.source}}};var Me,Ue,De;w.parameters={...w.parameters,docs:{...(Me=w.parameters)==null?void 0:Me.docs,source:{originalSource:`{
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
}`,...(De=(Ue=w.parameters)==null?void 0:Ue.docs)==null?void 0:De.source}}};var Pe,Ye,Ve;N.parameters={...N.parameters,docs:{...(Pe=N.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
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
}`,...(Ve=(Ye=N.parameters)==null?void 0:Ye.docs)==null?void 0:Ve.source}}};const at=["Info","Success","Warning","Error","AllVariants","TitleOnly","SuccessNoDescription","WithAction","SuccessWithAction","LongContent","LongTitle","SaveSuccess","DeleteConfirmation","FormValidation","NetworkError","UploadSuccess","PermissionDenied","MultipleToasts","AutoDismiss","DarkMode","Interactive","ToastStack"];export{d as AllVariants,y as AutoDismiss,B as DarkMode,x as DeleteConfirmation,l as Error,j as FormValidation,a as Info,w as Interactive,h as LongContent,f as LongTitle,S as MultipleToasts,k as NetworkError,C as PermissionDenied,g as SaveSuccess,n as Success,m as SuccessNoDescription,v as SuccessWithAction,u as TitleOnly,N as ToastStack,T as UploadSuccess,c as Warning,p as WithAction,at as __namedExportsOrder,ot as default};
