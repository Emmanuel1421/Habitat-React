package org.example.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.dtos.response.ProcessResponse;
import org.example.enums.ProcessStatus;
import org.example.models.Associate;
import org.example.models.Process;
import org.example.models.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-22T21:10:02-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ProcessMapperImpl implements ProcessMapper {

    @Override
    public ProcessResponse toResponse(Process process) {
        if ( process == null ) {
            return null;
        }

        Long associateId = null;
        String associateName = null;
        Long internId = null;
        String internName = null;
        Long id = null;
        String processNumber = null;
        String city = null;
        String court = null;
        String description = null;
        ProcessStatus currentStatus = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        associateId = processAssociateId( process );
        associateName = processAssociateName( process );
        internId = processInternId( process );
        internName = processInternName( process );
        id = process.getId();
        processNumber = process.getProcessNumber();
        city = process.getCity();
        court = process.getCourt();
        description = process.getDescription();
        currentStatus = process.getCurrentStatus();
        createdAt = process.getCreatedAt();
        updatedAt = process.getUpdatedAt();

        ProcessResponse processResponse = new ProcessResponse( id, processNumber, city, court, description, currentStatus, associateId, associateName, internId, internName, createdAt, updatedAt );

        return processResponse;
    }

    @Override
    public List<ProcessResponse> toResponseList(List<Process> processes) {
        if ( processes == null ) {
            return null;
        }

        List<ProcessResponse> list = new ArrayList<ProcessResponse>( processes.size() );
        for ( Process process : processes ) {
            list.add( toResponse( process ) );
        }

        return list;
    }

    private Long processAssociateId(Process process) {
        if ( process == null ) {
            return null;
        }
        Associate associate = process.getAssociate();
        if ( associate == null ) {
            return null;
        }
        Long id = associate.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String processAssociateName(Process process) {
        if ( process == null ) {
            return null;
        }
        Associate associate = process.getAssociate();
        if ( associate == null ) {
            return null;
        }
        String name = associate.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long processInternId(Process process) {
        if ( process == null ) {
            return null;
        }
        User intern = process.getIntern();
        if ( intern == null ) {
            return null;
        }
        Long id = intern.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String processInternName(Process process) {
        if ( process == null ) {
            return null;
        }
        User intern = process.getIntern();
        if ( intern == null ) {
            return null;
        }
        String name = intern.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
