import React, { useRef } from 'react'
import { useState } from 'react'
import CustomCurrency from 'src/components/CustomCurrency'

const ContentEditableWithRef = props => {
  const defaultValue = useRef(props.value)

  const handleInput = event => {
    if (props.onChange) {
      props.onChange(event)
    }
  }

  return (
    <div
      contentEditable={props?.disabled}
      style={props?.style}
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  )
}

const StepFourFragment = ({ contratSkeletonLocalData, setContratSkeletonLocalData, isSuccess, isFetching }) => {
  (Array.isArray(contratSkeletonLocalData) ? contratSkeletonLocalData : []).forEach(item => {
    item?.fields?.map(field => {
      if (['properties'].includes(field?.type)) {
        field?.data?.properties?.map(current => {
          // /* removed */
          // current?.map(currentRow => {
          //   // currentRow?.map(currentInfo => {})
          // })
        })
      }
    })
  })

  return (
    <>
      {isSuccess && !isFetching ? (
        <div className='mt-11 pl-5'>
          {(Array.isArray(contratSkeletonLocalData) ? contratSkeletonLocalData : []).map(item => {
            return (
              <div
                key={item?.id}
                style={{
                  marginBottom: 40
                }}
              >
                {/* <h3 dangerouslySetInnerHTML={{ __html: `<div style=${item?.style}>${item?.title}</div>` }}></h3> */}
                <h3>{item?.title}</h3>

                {item?.fields?.map(field => (
                  <div
                    key={field?.id}
                    style={{
                      marginBottom: 20
                    }}
                  >
                    {['text', 'table', 'image'].includes(field?.type) && (
                      <ContentEditableWithRef
                        disabled={!field?.data.includes('disabled')}
                        value={field?.data}
                        onChange={e => {
                          const editorFieldData = e.currentTarget.innerHTML
                          setContratSkeletonLocalData(d => {
                            return contratSkeletonLocalData?.map(e => {
                              if (e?.id == item?.id) {
                                const tempD = {
                                  ...e,
                                  fields: e?.fields?.map(fieldd => {
                                    if (fieldd?.id == field?.id) {
                                      return { ...fieldd, data: editorFieldData }
                                    }

                                    return fieldd
                                  })
                                }

                                return tempD
                              }

                              return e
                            })
                          })
                        }}
                        style={{
                          padding: 10,
                          border: '1px solid #a1a1a1',
                          borderRadius: 10,
                          boxShadow:
                            '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)'
                        }}
                      />
                    )}

                    {/* Showing Properties */}
                    <div className=''>
                      {['properties'].includes(field?.type) && (
                        <div className='grid  gap-4 justify-self-center my-4'>
                          {/* <table className='min-w-full border-collapse border border-gray-200 mt-4'>
                            <tbody>
                              {field?.data?.properties?.map((current, indexCurrent) => (
                                <tr key={indexCurrent}>
                                  <td className='p-4 border border-gray-800'>
                                    <strong> {current.discount}</strong>
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                 {current &&
                                    current?.length &&
                                    current?.map((currentInfo, infoIndex) => (
                                      <tr key={infoIndex}>
                                        <td className='p-4 border border-gray-800'>
                                          <strong> {currentInfo.key}</strong>
                                        </td>
                                        <td className='p-4 border border-gray-800'>
                                          {currentInfo.key === 'Nom de projet' || currentInfo.key === 'Nom de bien' ? (
                                            <>{currentInfo.value}</>
                                          ) : (
                                            <CustomCurrency
                                              value={currentInfo.value ?? 0}
                                              suffix={' TN'}
                                              allowNegative={false}
                                            />
                                          )}
                                        </td>
                                      </tr>
                                    ))} 
                              </tr>
                            </tbody>
                          </table> */}
                          <strong>Liste des biens</strong>
                          <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                              <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Référence
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Intitulé
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Prix Unitaire HT
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Montant TVA
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Montant TTC
                                </th>
                              </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                              {field?.data?.properties?.map((property, indexCurrent) => (
                                <tr key={indexCurrent}>
                                  <td className='px-6 py-2 whitespace-nowrap text-sm'>
                                    {property?.reference_property}
                                  </td>
                                  <td className='px-6 py-2 whitespace-nowrap text-sm'>{property?.entitled_property}</td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={property?.price_unitaire_HT ?? 0} allowNegative={false} />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={property?.amount_TVA ?? 0} allowNegative={false} />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={property?.price_unitaire_TTC ?? 0} allowNegative={false} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <strong>Total des frais</strong>
                          <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                              <tr>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  CPF
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Frais d'inscription
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Frais complémentaires d'inscription
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Frais de lotissement
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Frais de syndic
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Frais de dossier
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Frais d'avocat
                                </th>
                                <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                  Autres frais
                                </th>
                              </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                              <tr>
                                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                  <CustomCurrency value={field?.data?.fees?.cpf_total ?? 0} allowNegative={false} />
                                </td>
                                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                  <CustomCurrency
                                    value={field?.data?.fees?.registration_fees_total ?? 0}
                                    allowNegative={false}
                                  />
                                </td>
                                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                  <CustomCurrency
                                    value={field?.data?.fees?.registration_fees_compl_total ?? 0}
                                    allowNegative={false}
                                  />
                                </td>
                                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                  <CustomCurrency
                                    value={field?.data?.fees?.lotiss_fees_total ?? 0}
                                    allowNegative={false}
                                  />
                                </td>
                                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                  <CustomCurrency
                                    value={field?.data?.fees?.trustee_fees_total ?? 0}
                                    allowNegative={false}
                                  />
                                </td>
                                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                  <CustomCurrency
                                    value={field?.data?.fees?.folder_fees_total ?? 0}
                                    allowNegative={false}
                                  />
                                </td>
                                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                  <CustomCurrency
                                    value={field?.data?.fees?.lawyer_fees_total ?? 0}
                                    allowNegative={false}
                                  />
                                </td>
                                <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                  <CustomCurrency
                                    value={field?.data?.fees?.others_fees_total ?? 0}
                                    allowNegative={false}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div>
                  {/* {contratSkeletonLocalData?.map(item =>
                    item?.fields?.map(
                      field =>
                        ['properties'].includes(field?.type) &&
                        field?.data?.map(current => (
                          <a key={current.id} href={`your_link_here/${current.id}`}>
                            {`Link ${current.id}`}
                          </a>
                        ))
                    )
                  )} */}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div class='flex justify-center items-center mt-10'>
          <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}
    </>
  )
}

export default StepFourFragment
